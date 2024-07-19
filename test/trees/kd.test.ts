import { TreeError, TreeErrorCode } from "../../src/trees/Error";
import { KDTree } from "../../src/trees/kd";
import { fail } from "../utils";
import { verifyKdTreeProperty } from "../utils/trees";
import {
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
