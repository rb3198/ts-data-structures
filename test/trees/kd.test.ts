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
  searchClosestTests2d,
  searchRangeTests2d,
  searchRangeTests3d,
} from "./cases/kd";

const initializeTree = (
  k: number,
  inserts: {
    key: number[];
    value: string;
  }[],
  reBalanceFactor?: number
) => {
  const tree = new KDTree<string>(k, reBalanceFactor);
  inserts.forEach(({ key, value }) => tree.insert(key, value));
  return tree;
};

describe("Insertion tests", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it.each(insertionTests2d)(
    "Should maintain KD Tree property on insertion --- 2D Tree",
    (test) => {
      const { inserts, inOrderTraversal } = test;
      const tree = new KDTree<string>(2);
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
      const tree = new KDTree(2, 5);
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
      const tree = initializeTree(2, inserts);
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
        const tree = new KDTree(k);
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
      const tree = initializeTree(2, inserts);
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
      const tree = initializeTree(3, inserts);
      expect(tree.inOrderTraversal(tree.root)).toEqual(initialInOrderTraversal);
      expect(verifyKdTreeProperty(3, 0, tree.root)).toBe(true);
      tree.reBalanceTree();
      expect(verifyKdTreeProperty(3, 0, tree.root)).toBe(true);
      expect(tree.inOrderTraversal(tree.root)).toEqual(postBalancingTraversal);
    }
  );
});

describe("Search tests", () => {
  it.each(insertionTests2d)(
    "Should return a tuple of <key, value> on successful search -- 2D Tree",
    (test) => {
      const { inserts } = test;
      const tree = initializeTree(2, inserts);
      inserts.forEach(({ key, value }) => {
        const [resultKey, resultValue] = tree.search(key);
        expect(resultKey).toEqual(key);
        expect(resultValue).toBe(value);
      });
    }
  );

  it.each(insertionTests3d)(
    "Should return a tuple of <key, value> on successful search -- 3D Tree",
    (test) => {
      const { inserts } = test;
      const tree = initializeTree(3, inserts);
      inserts.forEach(({ key, value }) => {
        const [resultKey, resultValue] = tree.search(key);
        expect(resultKey).toEqual(key);
        expect(resultValue).toBe(value);
      });
    }
  );
  it("Should throw a KeyNotFound error on unsuccessful search", () => {
    const [test] = insertionTests2d;
    const { inserts } = test;
    const tree = initializeTree(2, inserts);
    const searchKey = [10, 10];
    try {
      tree.search(searchKey);
      fail(
        `Search should have thrown an error on non-existing key ${searchKey}`
      );
    } catch (error) {
      if (!(error instanceof TreeError)) {
        fail(`Error should have been a tree error. Got: ${error}`);
        return;
      }
      const { code, message } = error;
      expect(code).toBe(TreeErrorCode.NotFound);
      expect(message).toBe(`Could not find any data on the point 10,10`);
    }
  });
});

describe("Search closest tests", () => {
  it.each(searchClosestTests2d.tests)(
    "Should return the closest point to the searched point -- 2D Tree",
    ({ testPoint, expected }) => {
      const { inserts } = searchClosestTests2d;
      const tree = initializeTree(2, inserts);
      const [actualKey] = tree.searchClosest(testPoint);
      expect(actualKey).toEqual(expected);
    }
  );
  it("Should throw an error if called when tree is empty", () => {
    const tree = initializeTree(2, []);
    try {
      const searchKey = [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ];
      tree.searchClosest(searchKey);
      fail(
        "Expected `SearchClosest` to throw an error on searching an uninitialized tree."
      );
    } catch (error) {
      if (!(error instanceof TreeError)) {
        fail(`Should have thrown a tree error. Received: ${error}`);
        return;
      }
      const { code, message } = error;
      expect(code).toBe(TreeErrorCode.BadOperation);
      expect(message).toBe("Need to initialize the tree before searching.");
    }
  });
});

describe("Search Range tests", () => {
  it.each(searchRangeTests2d)("Should search range --2D Tree", (test) => {
    const { inserts, expectedOutput, rect } = test;
    const tree = initializeTree(2, inserts);
    const output = tree.searchRange(rect);
    expect(output).toEqual(expectedOutput);
  });

  it.each(searchRangeTests3d)("Should search range --3D Tree", (test) => {
    const { inserts, expectedOutput, cube } = test;
    const tree = initializeTree(3, inserts);
    const output = tree.searchRange(cube);
    expect(output).toEqual(expectedOutput);
  });
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
      const tree = new KDTree<string>(2);
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

describe("Update tests", () => {
  it("Should update if key found", () => {
    const [test] = insertionTests2d;
    const { inserts } = test;
    const tree = initializeTree(2, inserts);
    tree.update([7, 8], "Kebab");
    expect(tree.search([7, 8])).toEqual([[7, 8], "Kebab"]);
  });
  it("Should throw a `BadOperation` error if key is of different dimension than the tree's k", () => {
    try {
      const tree = initializeTree(2, [{ key: [10, 10], value: "A" }]);
      tree.update([10, 10, 10], "K");
      fail(
        "Should have thrown an error on updating key on a different dimension."
      );
    } catch (error) {
      if (!(error instanceof TreeError)) {
        fail("Should have thrown a `TreeError`");
        return;
      }
      const { code, message } = error;
      expect(code).toBe(TreeErrorCode.BadOperation);
      expect(message)
        .toBe(`Invalid key. The number of elements (dimensions) in the key must match the parameter 'k' passed to the constructor.\n
        Expected length: 2. Actual length: 3`);
    }
  });
  it("Should throw a `BadOperation` error if key is non-existent", () => {
    try {
      const tree = initializeTree(2, [{ key: [10, 10], value: "A" }]);
      tree.update([10, 20], "K");
      fail("Should have thrown an error on updating a non-existent key.");
    } catch (error) {
      if (!(error instanceof TreeError)) {
        fail("Should have thrown a `TreeError`");
        return;
      }
      const { code, message } = error;
      expect(code).toBe(TreeErrorCode.BadOperation);
      expect(message).toBe("Cannot update a non-existent point(key).");
    }
  });
});
