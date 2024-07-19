import { TreeError, TreeErrorCode } from "../../src/trees/Error";
import { KDTree } from "../../src/trees/kd";
import { fail } from "../utils";
import { verifyKdTreeProperty } from "../utils/trees";
import {
  imbalancedInsertions2d,
  imbalancedInsertions3d,
  improperKeyLengthInsertions,
  insertionTests2d,
  insertionTests3d,
} from "./cases/kd";
const k = 2;

describe("Insertion tests", () => {
  let tree: KDTree<string>;
  beforeEach(() => {
    tree = new KDTree(k);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it.each(insertionTests2d)(
    "Should maintain KD Tree property on insertion --- 2D Tree",
    (test) => {
      const { inserts, inOrderTraversal } = test;
      const tree = new KDTree<string>(k);
      inserts.forEach((insert) => {
        const { key, value } = insert;
        tree.insert(key, value);
        expect(verifyKdTreeProperty(tree.k, 0, tree.root)).toBe(true);
      });
      const actualTraversal = tree.inOrderTraversal(tree.root);
      expect(actualTraversal).toEqual(inOrderTraversal);
    }
  );
  it.each(insertionTests3d)(
    "Should maintain KD property on insertion --- 3D Tree",
    (test) => {
      const { inserts, inOrderTraversal } = test;
      const tree = new KDTree<string>(3);
      inserts.forEach((insert) => {
        const { key, value } = insert;
        tree.insert(key, value);
        expect(verifyKdTreeProperty(tree.k, 0, tree.root)).toBe(true);
      });
      const actualTraversal = tree.inOrderTraversal(tree.root);
      expect(actualTraversal).toEqual(inOrderTraversal);
    }
  );
  it.each(insertionTests2d)(
    "Should re-balance the tree after `reBalanceFactor` number of insertions if provided",
    (test) => {
      const tree = new KDTree(k, 5);
      const { inserts } = test;
      const reBalanceSpy = jest.spyOn(tree, "reBalanceTree");
      inserts.forEach(({ key, value }) => tree.insert(key, value));
      expect(reBalanceSpy).toHaveBeenCalledTimes(1);
    }
  );
  it("Should throw an error on duplicate key insertion", () => {
    try {
      const [test] = insertionTests2d;
      const { inserts } = test;
      inserts.forEach(({ key, value }) => tree.insert(key, value));
      tree.insert([7, 8], "Kaw");
      fail("Should have thrown a Tree Error");
    } catch (error) {
      if (!(error instanceof TreeError)) {
        fail("Should have thrown a Tree Error");
        return;
      }
      const { code, message } = error;
      expect(code).toBe(TreeErrorCode.DuplicateKey);
      expect(message).toBe("Duplicate keys not allowed");
    }
  });
  it.each(improperKeyLengthInsertions)(
    "Should throw an error on inserting keys not equal to k in length",
    (test) => {
      const { insert, k } = test;
      try {
        const [key, value] = insert;
        tree = new KDTree(k);
        tree.insert(key, value);
        fail("Should have thrown an error informing of improper key length");
      } catch (error) {
        if (!(error instanceof TreeError)) {
          fail("Should have thrown a Tree Error.");
          return;
        }
        const { code, message } = error;
        expect(code).toBe(TreeErrorCode.BadOperation);
        expect(message)
          .toBe(`Invalid key. The number of elements (dimensions) in the key must match the parameter 'k' passed to the constructor.\n
        Expected length: ${k}. Actual length: ${insert[0].length}`);
      }
    }
  );
});

describe("Re-balancing tests", () => {
  it.each(imbalancedInsertions2d)(
    "Should maintain KD Tree property post re-balancing --2D Tree",
    (test) => {
      const { initialInOrderTraversal, inserts, postBalancingTraversal } = test;
      const tree = new KDTree(2);
      inserts.forEach(({ key, value }) => {
        tree.insert(key, value);
      });
      expect(verifyKdTreeProperty(2, 0, tree.root)).toBe(true);
      expect(tree.inOrderTraversal(tree.root)).toEqual(initialInOrderTraversal);
      tree.reBalanceTree();
      expect(verifyKdTreeProperty(2, 0, tree.root)).toBe(true);
      expect(tree.inOrderTraversal(tree.root)).toEqual(postBalancingTraversal);
    }
  );
  it.each(imbalancedInsertions3d)(
    "Should maintain KD Tree property post re-balancing --3D Tree",
    (test) => {
      const { initialInOrderTraversal, inserts, postBalancingTraversal } = test;
      const tree = new KDTree(3);
      inserts.forEach(({ key, value }) => {
        tree.insert(key, value);
      });
      expect(tree.inOrderTraversal(tree.root)).toEqual(initialInOrderTraversal);
      expect(verifyKdTreeProperty(3, 0, tree.root)).toBe(true);
      tree.reBalanceTree();
      expect(verifyKdTreeProperty(3, 0, tree.root)).toBe(true);
      expect(tree.inOrderTraversal(tree.root)).toEqual(postBalancingTraversal);
    }
  );
});

describe("Deletion tests", () => {
  const testDeletion = (
    k: number,
    tree: KDTree<string>,
    test: {
      inserts: { key: number[]; value: string }[];
      inOrderTraversal: (string | number[])[][];
    }
  ) => {
    const { inserts: insertsOg } = test;
    const inserts = [...insertsOg];
    inserts.forEach(({ key, value }) => tree.insert(key, value));
    while (inserts.length > 1) {
      const randomElementIdx = Math.floor(Math.random() * inserts.length);
      const randomElement = inserts[randomElementIdx];
      if (!randomElement) {
        fail("Test logic failure.");
        return;
      }
      const { key, value } = randomElement;
      const searchResult = tree.search(key);
      // Ensuring that the element is present in the tree before attempting to delete it.
      expect(searchResult).toEqual([key, value]);
      const root = tree.delete(key);
      expect(root).toBe(tree.root);
      expect(verifyKdTreeProperty(k, 0, root)).toBe(true);
      try {
        tree.search(key);
      } catch (error) {
        // Searching the deleted element should throw a `KeyNotFound` error post deletion.
        if (!(error instanceof TreeError)) {
          console.log(key);
          tree.printTree();
          fail(
            `Unexpected type of error occurred when testing the delete logic. ${error}`
          );
          return;
        }
        const { code } = error;
        expect(code).toBe(TreeErrorCode.NotFound);
      }
      inserts.splice(randomElementIdx, 1);
    }
    expect(tree.root).not.toBeFalsy();
    expect(tree.root?.key).toEqual(inserts[0].key);
  };
  it.each(insertionTests2d)(
    "Should maintain KD Tree property after deletion --2D Tree",
    (test) => {
      const tree = new KDTree<string>(k);
      testDeletion(2, tree, test);
    }
  );
  it.each(insertionTests3d)(
    "Should maintain KD Tree property after deletion --3D Tree",
    (test) => {
      const tree = new KDTree<string>(3);
      testDeletion(3, tree, test);
    }
  );
  it("Should re-balance the tree if `reBalanceFactor` of the tree is not `Infinity`", () => {
    const [test] = insertionTests2d;
    const reBalanceFactor = 3,
      k = 2;
    const tree = new KDTree<string>(k, reBalanceFactor);
    const reBalanceSpy = jest
      .spyOn(tree, "reBalanceTree")
      .mockImplementation(() => {});
    testDeletion(2, tree, test);
    // 9 inserts + 8 deletions = 17 ops. reBalanceFactor = 3, so re-balancing should've been performed 5 times.
    expect(reBalanceSpy).toHaveBeenCalledTimes(5);
  });
});
