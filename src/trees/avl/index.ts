import { TreeError, TreeErrorCode } from "../Error";
import { Node } from "./Node";

export class AVLTree<K, V> {
  root?: Node<K, V> | null;
  constructor(records?: [K, V][]) {
    if (records && records.length > 0) {
      this.insertMany(records);
    }
  }

  private insertHelper = (
    root: Node<K, V> | undefined | null,
    key: K,
    value: V
  ) => {
    if (!root) {
      return new Node(key, value);
    }
    if (key === root.key) {
      throw new TreeError(
        TreeErrorCode.DuplicateKey,
        `Data with key ${key} already exists!`
      );
    }
    if (key < root.key) {
      root.left = this.insertHelper(root.left, key, value);
    } else {
      root.right = this.insertHelper(root.right, key, value);
    }
    return this.balanceTree(root, key);
  };

  private balanceTree = (root: Node<K, V>, key: K) => {
    const leftHeight = root.left?.height ?? 0;
    const rightHeight = root.right?.height ?? 0;
    root.height = 1 + Math.max(leftHeight, rightHeight);
    const balance = leftHeight - rightHeight;
    if (balance > 1 && key < root.left?.key!) {
      return this.llRotate(root);
    }
    if (balance < -1 && key > root.right?.key!) {
      return this.rrRotate(root);
    }
    if (balance > 1 && key > root.left?.key!) {
      return this.lrRotate(root);
    }
    if (balance < -1 && key < root.right?.key!) {
      return this.rlRotate(root);
    }
    return root;
  };

  insert = (key: K, value: V) => {
    if (!this.root) {
      this.root = new Node(key, value);
      return;
    }
    this.root = this.insertHelper(this.root, key, value);
  };

  insertMany = (records: [K, V][]) => {
    records.forEach(([key, value]) => this.insert(key, value));
  };

  delete = (key: K) => {
    if (!this.root) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        `Cannot delete a node in an empty tree`
      );
    }
    this.root = this.deleteHelper(key, this.root);
  };

  private deleteHelper = (
    key: K,
    root?: Node<K, V> | null
  ): Node<K, V> | undefined | null => {
    if (!root) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        `Cannot delete a node that was never inserted`
      );
    }
    if (key < root.key) {
      root.left = this.deleteHelper(key, root.left);
    } else if (key > root.key) {
      root.right = this.deleteHelper(key, root.right);
    } else {
      // Standard BST deletion
      if (!root.left || !root.right) {
        // One child / no child
        let temp: Node<K, V> | undefined | null;
        if (!root.left) {
          temp = root.right;
        } else {
          temp = root.left;
        }
        // No child
        if (!temp) {
          return null;
        }
        root = temp;
      } else {
        let temp = this.getMinValueNode(root.right);
        root.key = temp?.key!;
        root.data = temp?.data!;
        root.right = this.deleteHelper(temp?.key!, root.right);
      }
    }
    root.height = this.getHeight(root);
    const { left, right } = root;
    const balance = (root.left?.height ?? 0) - (root.right?.height ?? 0);
    const leftBalance = (left?.left?.height ?? 0) - (left?.right?.height ?? 0);
    const rightBalance =
      (right?.left?.height ?? 0) - (right?.right?.height ?? 0);
    if (balance > 1 && leftBalance >= 0) {
      return this.llRotate(root);
    }
    if (balance > 1 && leftBalance < 0) {
      return this.lrRotate(root);
    }
    if (balance < -1 && rightBalance <= 0) {
      return this.rrRotate(root);
    }
    if (balance < -1 && rightBalance > 0) {
      return this.rlRotate(root);
    }
    return root;
  };

  getMinValueNode = (root?: Node<K, V> | null): Node<K, V> | null => {
    if (!root) {
      return null;
    }
    if (!root.left) {
      return root;
    }
    return this.getMinValueNode(root.left);
  };

  search = (searchKey: K): [K, V] => {
    if (!this.root) {
      throw new TreeError(
        TreeErrorCode.NotFound,
        `Could not find a node with search key ${searchKey}`
      );
    }
    let ptr: Node<K, V> | undefined | null = this.root;
    while (ptr) {
      const { key, data, right } = ptr;
      if (searchKey === key) {
        return [key, data];
      }
      if (searchKey < key) {
        ptr = ptr.left;
      } else {
        ptr = right;
      }
    }
    throw new TreeError(
      TreeErrorCode.NotFound,
      `Could not find a node with search key ${searchKey}`
    );
  };

  /**
   * Returns the value whose search key is closest to the input search key.
   * @param searchKey
   */
  searchClosest = (searchKey: K): [K, V][] => {
    if (!this.root) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot search in an empty tree"
      );
    }
    const { left, right, key, data } = this.root;
    if (!left && !right) {
      return [[key, data]];
    }
    return this.searchClosestHelper(searchKey, this.root);
  };

  private searchClosestHelper = (
    searchKey: K,
    root?: Node<K, V> | null,
    minDistRoots: Node<K, V>[] = []
  ): [K, V][] => {
    if (!root) {
      return minDistRoots.map((root) => [root.key, root.data]);
    }
    const { key, data } = root;
    let minDist =
      minDistRoots && minDistRoots.length > 0
        ? // @ts-ignore
          Math.abs(minDistRoots[0].key - searchKey)
        : Infinity;
    // @ts-ignore
    const dist = Math.abs(key - searchKey);
    if (dist === 0) {
      // Exact match found, no other node can match this, since IDs are unique.
      return [[key, data]];
    }
    if (dist < minDist) {
      minDistRoots = [root];
    }
    if (searchKey < key) {
      return this.searchClosestHelper(searchKey, root.left, minDistRoots);
    }
    return this.searchClosestHelper(searchKey, root.right, minDistRoots);
  };

  getHeight = (root: Node<K, V>) => {
    return 1 + Math.max(root?.left?.height ?? 0, root?.right?.height ?? 0);
  };
  //#region Rotation Methods
  private llRotate = (root: Node<K, V>) => {
    const lChild = root.left;
    if (!lChild) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot LL Rotate without a left child."
      );
    }
    const lrTree = lChild?.right;
    lChild.right = root;
    root.left = lrTree;
    root.height = this.getHeight(root);
    lChild.height = this.getHeight(lChild);
    return lChild;
  };
  private rrRotate = (root: Node<K, V>) => {
    const rChild = root.right;
    if (!rChild) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot RR Rotate without a right child."
      );
    }
    const rlTree = rChild.left;
    rChild.left = root;
    root.right = rlTree;
    root.height = this.getHeight(root);
    rChild.height = this.getHeight(rChild);
    return rChild;
  };
  private lrRotate = (root: Node<K, V>) => {
    const lChild = root.left;
    if (!lChild) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot LR Rotate without a left child."
      );
    }
    const lrChild = lChild.right;
    if (!lrChild) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot LR Rotate without a LR grandchild of the root."
      );
    }
    const lrlTree = lrChild.left;
    const lrrTree = lrChild.right;
    lChild.right = lrlTree;
    root.left = lrrTree;
    lrChild.right = root;
    lrChild.left = lChild;
    root.height = this.getHeight(root);
    lChild.height = this.getHeight(lChild);
    lrChild.height = this.getHeight(lrChild);
    return lrChild;
  };
  private rlRotate = (root: Node<K, V>) => {
    const rChild = root.right;
    if (!rChild) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot RL Rotate without a left child."
      );
    }
    const rlChild = rChild.left;
    if (!rlChild) {
      throw new TreeError(
        TreeErrorCode.BadOperation,
        "Cannot RL Rotate without a RL grandchild of the root."
      );
    }
    const rllTree = rlChild.left;
    const rlrTree = rlChild.right;
    rChild.left = rlrTree;
    root.right = rllTree;
    rlChild.right = rChild;
    rlChild.left = root;
    root.height = this.getHeight(root);
    rChild.height = this.getHeight(rChild);
    rlChild.height = this.getHeight(rlChild);
    return rlChild;
  };
  //#endregion

  //#region Traversal Methods
  bfsTraversal = (): [K, V][] => {
    if (!this.root) {
      return [];
    }
    const queue: Node<K, V>[] = [];
    queue.push(this.root);
    const result: [K, V][] = [];
    while (queue.length) {
      const { key, data, left, right } = queue.shift()!;
      result.push([key, data]);
      if (left) {
        queue.push(left);
      }
      if (right) {
        queue.push(right);
      }
    }
    return result;
  };
  /**
   * Pre-order traversal of the built up tree.
   * @param root
   * @param result
   * @returns
   */
  preOrderTraversal = (root?: Node<K, V> | null, result: [K, V][] = []) => {
    if (!root) {
      return result;
    }
    const { key, data, left, right } = root;
    result.push([key, data]);
    this.preOrderTraversal(left, result);
    this.preOrderTraversal(right, result);
    return result;
  };
  /**
   * In-order traversal - Equivalent to getting a sorted array of data stored in the tree.
   * @param root
   * @param result
   * @returns
   */
  inOrderTraversal = (root?: Node<K, V> | null, result: [K, V][] = []) => {
    if (!root) {
      return result;
    }
    const { key, data, left, right } = root;
    this.inOrderTraversal(left, result);
    result.push([key, data]);
    this.inOrderTraversal(right, result);
    return result;
  };
  /**
   * Post-order traversal of the built up tree
   * @param root
   * @param result
   * @returns
   */
  postOrderTraversal = (root?: Node<K, V> | null, result: [K, V][] = []) => {
    if (!root) {
      return result;
    }
    const { key, data, left, right } = root;
    this.postOrderTraversal(left, result);
    this.postOrderTraversal(right, result);
    result.push([key, data]);
    return result;
  };

  /**
   * Get data in descending order of its keys.
   * @param root
   * @param result
   */
  descendingTraversal = (root?: Node<K, V> | null, result: [K, V][] = []) => {
    if (!root) {
      return result;
    }
    const { key, data, left, right } = root;
    this.descendingTraversal(right, result);
    result.push([key, data]);
    this.descendingTraversal(left, result);
    return result;
  };

  printTree() {
    if (!this.root) return;

    // Helper function to get the height of the tree
    function getHeight(node?: Node<K, V> | null): number {
      if (!node) return 0;
      return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }

    const height = getHeight(this.root);
    const width = Math.pow(2, height) - 1;

    const result = Array.from({ length: height }, () => Array(width).fill(" "));

    // Helper function to fill the result array
    function fill(node: Node<K, V>, level: number, pos: number) {
      if (!node) return;

      result[level][pos] = node.key;

      const offset = Math.pow(2, height - level - 2);

      if (node.left) fill(node.left, level + 1, pos - offset);
      if (node.right) fill(node.right, level + 1, pos + offset);
    }

    fill(this.root, 0, Math.floor((width - 1) / 2));

    result.forEach((row) => console.log(row.join("")));
  }
  //#endregion
}
