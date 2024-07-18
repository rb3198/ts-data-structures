import { IArea } from "../../types/geometry";
import { TreeError, TreeErrorCode } from "../Error";
import { Node } from "./Node";

export class KDTree<V> {
  /**
   * The number of dimensions this tree belongs to. The key of each node will be of 'k' dims.
   */
  private _k: number;
  public get k(): number {
    return this._k;
  }
  private set k(k: number) {
    this._k = k;
  }

  /**
   * The tree automatically re-balances itself after `reBalanceFactor` number of operations.
   *
   * Can be set to Infinity to never re-balance automatically.
   * @default Infinity
   */
  reBalanceFactor: number;
  private nOps: number = 0;
  root?: Node<V> | null;
  constructor(k: number, reBalanceFactor?: number) {
    this._k = k;
    this.reBalanceFactor = reBalanceFactor || Infinity;
    this.nOps = this.nOps || 0;
  }

  //#region Public methods
  insert = (key: number[], value: V) => {
    if (key.length !== this.k) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        `Invalid key. The number of elements (dimensions) in the key must match the parameter 'k' passed to the constructor.\n
        Expected length: ${this.k}. Actual length: ${key?.length ?? 0}`
      );
    }
    this.root = this.insertHelper(key, value, 0, this.root);
    this.nOps++;
    if (this.nOps % this.reBalanceFactor === 0) {
      this.reBalanceTree();
    }
  };

  update = (key: number[], value: V) => {
    if (key.length !== this.k) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        `Invalid key. The number of elements (dimensions) in the key must match the parameter 'k' passed to the constructor.\n
        Expected length: ${this.k}. Actual length: ${key?.length ?? 0}`
      );
    }
    this.root = this.updateHelper(key, value, 0, this.root);
  };

  //#region Search methods
  search = (key: number[]): [number[], V] => {
    let ptr = this.root,
      depth = 0;
    while (ptr) {
      let idx = depth % this.k;
      if (this.arePointsIdentical(key, ptr.key)) {
        return [key, ptr.data];
      }
      if (key[idx] < ptr.key[idx]) {
        ptr = ptr.left;
      } else {
        ptr = ptr.right;
      }
      depth++;
    }
    throw new TreeError(
      TreeErrorCode.NotFound,
      `Could not find any data on the point ${key.toString()}`
    );
  };

  searchClosest = (key: number[]): [number[], V] => {
    const closestNode = this.searchClosestHelper(key, 0, this.root);
    if (!closestNode) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Need to initialize the tree before searching."
      );
    }
    return [closestNode.key, closestNode.data];
  };

  searchRange = (range: IArea) => {
    if (!this.root) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Tree must be initialized before searching an area"
      );
    }
    const nodes = this.searchRangeHelper(range, [], 0, this.root);
    return nodes;
  };
  //#endregion

  delete = (key: number[]) => {
    this.root = this.deleteHelper(key, 0, this.root);
    this.nOps++;
    if (this.nOps % this.reBalanceFactor === 0) {
      this.reBalanceTree();
    }
  };

  printTree() {
    if (!this.root) return;

    // Helper function to get the height of the tree
    function getHeight(node?: Node<V> | null): number {
      if (!node) return 0;
      return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }

    const height = getHeight(this.root);
    const width = Math.pow(2, height) - 1;

    const result = Array.from({ length: height }, () =>
      Array(width).fill("   ")
    );

    // Helper function to fill the result array
    function fill(node: Node<V>, level: number, pos: number) {
      if (!node) return;

      result[level][pos] = node.key;

      const offset = Math.pow(2, height - level - 2);

      if (node.left) fill(node.left, level + 1, pos - offset);
      if (node.right) fill(node.right, level + 1, pos + offset);
    }

    fill(this.root, 0, Math.floor((width - 1) / 2));

    result.forEach((row) => console.log(row.join("")));
  }

  /**
   * Re-balances the tree.
   *
   * Uses QuickSelect to sort the tree. May change the root of the tree.
   */
  reBalanceTree = () => {
    const nodes = this.inOrderTraversal(this.root, []);
    let depth = 0;
    const { node, pivotIdx: mid } = this.quickSelect(
      0,
      nodes.length - 1,
      Math.floor(nodes.length / 2),
      depth,
      nodes
    );
    this.root = node;
    const { left, right } = this.getLeftRightNodes(nodes, mid, 0);
    const queue: {
      ptr: Node<V>;
      left: [number[], V][];
      right: [number[], V][];
      depth: number;
    }[] = [];
    if (this.root) {
      queue.push({
        ptr: this.root,
        left,
        right,
        depth: 1,
      });
    }
    while (queue.length) {
      const { ptr, left, right, depth } = queue.shift()!;
      if (left.length) {
        const { node, pivotIdx: mid } = this.quickSelect(
          0,
          left.length - 1,
          Math.floor(left.length / 2),
          depth,
          left
        );
        ptr.left = node;
        if (ptr.left) {
          const { left: l, right: r } = this.getLeftRightNodes(
            left,
            mid,
            depth
          );
          queue.push({
            ptr: ptr.left,
            left: l,
            right: r,
            depth: depth + 1,
          });
        }
      }
      if (right.length) {
        const { node, pivotIdx: mid } = this.quickSelect(
          0,
          right.length - 1,
          Math.floor(right.length / 2),
          depth,
          right
        );
        ptr.right = node;
        if (ptr.right) {
          const { left: l, right: r } = this.getLeftRightNodes(
            right,
            mid,
            depth
          );
          queue.push({
            ptr: ptr.right,
            left: l,
            right: r,
            depth: depth + 1,
          });
        }
      }
    }
  };

  //#endregion

  //#region Traversal methods

  /**
   * In-order traversal of the tree, getting all the nodes.
   * @param root
   * @param result
   * @returns
   */
  inOrderTraversal = (root?: Node<V> | null, result: [number[], V][] = []) => {
    if (!root) {
      return result;
    }
    const { key, data, left, right } = root;
    this.inOrderTraversal(left, result);
    result.push([key, data]);
    this.inOrderTraversal(right, result);
    return result;
  };
  //#endregion
  //#region Private methods and helpers
  private insertHelper = (
    key: number[],
    value: V,
    level: number,
    root?: Node<V> | null
  ): Node<V> => {
    if (!root) {
      return new Node(key, value);
    }
    if (key[level % this.k] < root.key[level % this.k]) {
      root.left = this.insertHelper(key, value, level + 1, root.left);
    } else {
      root.right = this.insertHelper(key, value, level + 1, root.right);
    }
    return root;
  };

  private updateHelper = (
    key: number[],
    value: V,
    depth: number,
    root?: Node<V> | null
  ): Node<V> => {
    if (!root) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot update a non-existent point(key)."
      );
    }
    if (this.arePointsIdentical(root.key, key)) {
      root.data = value;
      return root;
    }
    const d = depth % this.k;
    if (key[d] < root.key[d]) {
      root.left = this.updateHelper(key, value, depth + 1, root.left);
    } else {
      root.right = this.updateHelper(key, value, depth + 1, root.right);
    }
    return root;
  };

  private arePointsIdentical = (p1: number[], p2: number[]) => {
    if (p1.length !== p2.length) {
      return false;
    }
    for (let i = 0; i < p1.length; i++) {
      if (p1[i] !== p2[i]) {
        return false;
      }
    }
    return true;
  };

  private deleteHelper = (
    key: number[],
    depth: number,
    root?: Node<V> | null
  ) => {
    if (!root) {
      return null;
    }
    const idx = depth % this.k;
    if (this.arePointsIdentical(root.key, key)) {
      // required node found
      if (root.right) {
        const minNode = this.findMinCoordNode(idx, depth + 1, root.right);
        root.data = minNode.data;
        root.key = minNode.key;
        root.right = this.deleteHelper(root.key, depth + 1, root.right);
      } else if (root.left) {
        const minNode = this.findMinCoordNode(idx, depth + 1, root.left);
        root.data = minNode.data;
        root.key = minNode.key;
        root.right = this.deleteHelper(root.key, depth + 1, root.left);
      } else {
        return null;
      }
      return root;
    }
    if (key[idx] < root.key[idx]) {
      root.left = this.deleteHelper(key, depth + 1, root.left);
    } else {
      root.right = this.deleteHelper(key, depth + 1, root.right);
    }
    return root;
  };

  private getDistance = (key: number[], root: Node<V>) => {
    let dist = 0;
    for (let i = 0; i < key.length; i++) {
      dist += (root.key[i] - key[i]) ** 2;
    }
    return Math.sqrt(dist);
  };

  private searchClosestHelper = (
    key: number[],
    depth: number,
    root?: Node<V> | null
  ) => {
    if (!root) {
      return null;
    }
    const d = depth % this.k;
    let nextNode: Node<V> | undefined | null,
      otherNode: Node<V> | undefined | null,
      bestNode: Node<V>;
    if (key[d] < root.key[d]) {
      nextNode = root.left;
      otherNode = root.right;
    } else {
      nextNode = root.right;
      otherNode = root.left;
    }
    let temp: Node<V> | undefined | null = this.searchClosestHelper(
      key,
      depth + 1,
      nextNode
    );
    bestNode =
      temp &&
      Math.min(this.getDistance(key, root), this.getDistance(key, temp)) ===
        this.getDistance(key, temp)
        ? temp
        : root;
    const radiusSquared = this.getDistance(key, bestNode) ** 2;
    const dist = key[depth % this.k] - root.key[depth % this.k];
    if (radiusSquared >= dist ** 2) {
      temp = this.searchClosestHelper(key, depth + 1, otherNode);
      bestNode =
        temp &&
        Math.min(
          this.getDistance(key, bestNode),
          this.getDistance(key, temp)
        ) === this.getDistance(key, temp)
          ? temp
          : bestNode;
    }
    return bestNode;
  };

  private searchRangeHelper = (
    range: IArea,
    solutions: Node<V>[],
    depth: number,
    root?: Node<V> | null
  ): Node<V>[] => {
    if (!root) {
      return solutions;
    }
    const axis = depth % this.k;
    const solutionsCopy = [...solutions];
    if (range.isWithinBounds(root.key)) {
      solutionsCopy.push(root);
      solutionsCopy.push(
        ...this.searchRangeHelper(range, [], depth + 1, root.left)
      );
      solutionsCopy.push(
        ...this.searchRangeHelper(range, [], depth + 1, root.right)
      );
      return solutionsCopy;
    }
    if (root.key[axis] < range.getMinCoord(axis)) {
      // Current point is to the left of the range, explore the right subtree only.
      solutionsCopy.push(
        ...this.searchRangeHelper(range, [], depth + 1, root.right)
      );
    } else if (root.key[axis] <= range.getMaxCoord(axis)) {
      // Current point is in the range, explore both left & right subtrees.
      solutionsCopy.push(
        ...this.searchRangeHelper(range, [], depth + 1, root.left)
      );
      solutionsCopy.push(
        ...this.searchRangeHelper(range, [], depth + 1, root.right)
      );
      return solutionsCopy;
    } else {
      // Current point is to the right of the range, explore left subtree only.
      solutionsCopy.push(
        ...this.searchRangeHelper(range, [], depth + 1, root.left)
      );
    }
    return solutionsCopy;
  };

  quickSelect = (
    l: number,
    r: number,
    k: number,
    depth: number,
    nodes: [number[], V][]
  ): { pivotIdx: number; node: Node<V> } => {
    const pivot = nodes[r];
    const [pivotKey, pivotValue] = pivot;
    const d = depth % this.k;
    if (r === l) {
      return {
        pivotIdx: r,
        node: new Node(pivotKey, pivotValue),
      };
    }
    let j = l;
    for (let i = l; i < r; i++) {
      const [key] = nodes[i];
      if (key[d] < pivotKey[d]) {
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
        j++;
      }
    }
    [nodes[j], nodes[r]] = [nodes[r], nodes[j]];
    if (j === k) {
      while (j > 0 && nodes[j - 1][0][d] === nodes[j][0][d]) {
        j--;
      }
      return {
        pivotIdx: j,
        node: new Node(nodes[j][0], nodes[j][1]),
      };
    }
    if (j < k) {
      return this.quickSelect(j + 1, r, k, depth, nodes);
    }
    return this.quickSelect(l, j - 1, k, depth, nodes);
  };

  private getLeftRightNodes = (
    nodes: [number[], V][],
    mid: number,
    depth: number
  ) => {
    const left: [number[], V][] = [],
      right: [number[], V][] = [];
    const [rootKey] = nodes[mid];
    const d = depth % this.k;
    for (let i = 0; i < nodes.length; i++) {
      if (i === mid) {
        continue;
      }
      const [key] = nodes[i];
      if (key[d] < rootKey[d]) {
        left.push(nodes[i]);
      } else {
        right.push(nodes[i]);
      }
    }
    return { left, right };
  };

  /**
   * Finds the node with the minimum `d` coordinate in its key in the tree rooted at `root`
   * @param d The coordinate that the initial root splits on.
   * @param depth current depth of the tree in the recursion.
   * @param root
   */
  private findMinCoordNode(d: number, depth: number, root: Node<V>): Node<V> {
    const idx = depth % this.k;
    if (!root.left && !root.right) {
      return root;
    }
    if (idx === d) {
      // conditional search
      if (root.left) {
        return this.findMinCoordNode(d, depth + 1, root.left);
      } else {
        return root;
      }
    }
    const comparisons = [root];
    // search both directions
    root.left &&
      comparisons.push(this.findMinCoordNode(d, depth + 1, root.left));
    root.right &&
      comparisons.push(this.findMinCoordNode(d, depth + 1, root.right));
    let minRoot: Node<V> | null = null;
    for (let i = 0; i < comparisons.length; i++) {
      if (!minRoot) {
        minRoot = comparisons[i];
      }
      if (comparisons[i].key[d] < minRoot.key[d]) {
        minRoot = comparisons[i];
      }
    }
    return minRoot!;
  }

  //#endregion
}
