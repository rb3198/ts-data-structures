type InsertionCase = {
  insert: [number, number];
  expectedPosition: number;
  expectedLength: number;
};

export const validBinaryPqInsertions: InsertionCase[] = [
  {
    insert: [5, 5],
    expectedPosition: 0,
    expectedLength: 1,
  },
  {
    insert: [1, 1],
    expectedPosition: 0,
    expectedLength: 2,
  },
  {
    insert: [2, 2],
    expectedPosition: 2,
    expectedLength: 3,
  },
  {
    insert: [4, 4],
    expectedPosition: 1,
    expectedLength: 4,
  },
  {
    insert: [3, 3],
    expectedPosition: 1,
    expectedLength: 5,
  },
];

// 3 5 4

export const deletions = [
  [
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
  ],
  [
    [3, 3],
    [5, 5],
    [4, 4],
  ],
  [
    [4, 4],
    [5, 5],
  ],
  [[5, 5]],
  [],
];
