import { AVLTree } from "../../dist/trees/avl";
import { AVLTreeError, AVLTreeErrorCode } from "../../dist/trees/avl/Error";

const commonInput: [number, string][] = [
  [10, "Ronit"],
  [20, "Hitesh"],
  [30, "Anirudh"],
  [8, "Saanya"],
  [6, "Manshiv"],
  [4, "Samantha"],
  [2, "Shaanti"],
  [15, "Pranav"],
  [21, "John"],
  [23, "Napoleon"],
  [5, "Pollock"],
  [1, "Elizabeth"],
  [0, "William"],
];

const insertTestCases: {
  input: [number, string][];
  expectedOutput: [number, string][];
  expectedHeight: number;
}[] = [
  {
    input: commonInput,
    expectedOutput: [
      [0, "William"],
      [1, "Elizabeth"],
      [2, "Shaanti"],
      [4, "Samantha"],
      [5, "Pollock"],
      [6, "Manshiv"],
      [8, "Saanya"],
      [10, "Ronit"],
      [15, "Pranav"],
      [20, "Hitesh"],
      [21, "John"],
      [23, "Napoleon"],
      [30, "Anirudh"],
    ],
    expectedHeight: 4,
  },
  {
    input: [
      [15, "Pranav"],
      [8, "Saanya"],
      [30, "Anirudh"],
      [20, "Hitesh"],
      [4, "Samantha"],
      [6, "Manshiv"],
      [2, "Shaanti"],
      [1, "Elizabeth"],
      [21, "John"],
      [10, "Ronit"],
      [23, "Napoleon"],
      [5, "Pollock"],
      [0, "William"],
    ],
    expectedOutput: [
      [0, "William"],
      [1, "Elizabeth"],
      [2, "Shaanti"],
      [4, "Samantha"],
      [5, "Pollock"],
      [6, "Manshiv"],
      [8, "Saanya"],
      [10, "Ronit"],
      [15, "Pranav"],
      [20, "Hitesh"],
      [21, "John"],
      [23, "Napoleon"],
      [30, "Anirudh"],
    ],
    expectedHeight: 5,
  },
];

const searchTestCases: {
  input: [number, string][];
  searchFor: number;
  expectedOutput: [number, string];
}[] = [
  {
    input: commonInput,
    searchFor: 10,
    expectedOutput: [10, "Ronit"],
  },
  {
    input: commonInput,
    searchFor: 8,
    expectedOutput: [8, "Saanya"],
  },
  {
    input: commonInput,
    searchFor: 23,
    expectedOutput: [23, "Napoleon"],
  },
];

const closestSearchTestCases: {
  input: [number, string][];
  searchFor: number;
  expectedOutput: [number, string][];
}[] = [
  {
    input: commonInput,
    searchFor: 11,
    expectedOutput: [[10, "Ronit"]],
  },
  {
    input: commonInput,
    searchFor: 17.5,
    expectedOutput: [[20, "Hitesh"]],
  },
  {
    input: commonInput,
    searchFor: 22,
    expectedOutput: [[23, "Napoleon"]],
  },
  {
    input: commonInput,
    searchFor: 23,
    expectedOutput: [[23, "Napoleon"]],
  },
];

describe("Insertion tests", () => {
  let tree: AVLTree<number, string> = new AVLTree();
  beforeEach(() => {
    tree = new AVLTree();
  });
  it.each(insertTestCases)(
    "Should add elements in a balanced and sorted order",
    (testCase) => {
      const { input, expectedOutput, expectedHeight } = testCase;
      tree.insertMany(input);
      const sortedOutput = tree.inOrderTraversal(tree.root);
      const height = tree.getHeight(tree.root!);
      expect(sortedOutput).toEqual(expectedOutput);
      expect(height).toBe(expectedHeight);
    }
  );

  it("Should throw an error on duplicate key insertion", () => {
    try {
      tree.insert(10, "Test 1");
      tree.insert(10, "Test 2");
      fail();
    } catch (error) {
      if (error instanceof AVLTreeError) {
        expect(error.code).toBe(AVLTreeErrorCode.DuplicateKey);
      } else {
        fail();
      }
    }
  });
});

describe("Search tests", () => {
  let tree: AVLTree<number, string> = new AVLTree();
  beforeEach(() => {
    tree = new AVLTree();
  });
  it("Should throw a NotFound error if the key being searched is not found", () => {
    tree.insertMany([
      [1, "Caesar"],
      [2, "Napoleon"],
    ]);
    try {
      tree.search(10);
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(AVLTreeError);
      if (error instanceof AVLTreeError) {
        expect(error.code).toBe(AVLTreeErrorCode.NotFound);
      } else {
        fail();
      }
    }
  });

  it("Should throw a NotFound error if the tree is uninitialized", () => {
    try {
      tree.search(10);
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(AVLTreeError);
      if (error instanceof AVLTreeError) {
        expect(error.code).toBe(AVLTreeErrorCode.NotFound);
      } else {
        fail();
      }
    }
  });

  it.each(searchTestCases)(
    "Should return the appropriate element if the key is present in the tree",
    ({ expectedOutput, input, searchFor }) => {
      tree.insertMany(input);
      const output = tree.search(searchFor);
      expect(output).toEqual(expectedOutput);
    }
  );

  it.each(closestSearchTestCases)(
    "Should return the appropriate element if the key is present in the tree",
    ({ expectedOutput, input, searchFor }) => {
      tree.insertMany(input);
      const output = tree.searchClosest(searchFor);
      expect(output).toEqual(expectedOutput);
    }
  );

  it("Should throw an error on searching for the closest node in an uninitialized tree", () => {
    try {
      const output = tree.searchClosest(10);
      fail();
    } catch (error) {
      if (error instanceof AVLTreeError) {
        expect(error.code).toBe(AVLTreeErrorCode.UnexpectedOperation);
      } else {
        fail();
      }
    }
  });
});
