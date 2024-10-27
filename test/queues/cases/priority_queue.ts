type InsertionCase = {
  insert: [number, number];
  expectedPosition: number;
  expectedLength: number;
  expectedQueue: [number, number][];
};

export const validBinaryPqInsertions: InsertionCase[] = [
  {
    insert: [5, 5],
    expectedPosition: 0,
    expectedLength: 1,
    expectedQueue: [[5, 5]],
  },
  {
    insert: [1, 1],
    expectedPosition: 0,
    expectedLength: 2,
    expectedQueue: [
      [1, 1],
      [5, 5],
    ],
  },
  {
    insert: [2, 2],
    expectedPosition: 2,
    expectedLength: 3,
    expectedQueue: [
      [1, 1],
      [5, 5],
      [2, 2],
    ],
  },
  {
    insert: [4, 4],
    expectedPosition: 1,
    expectedLength: 4,
    expectedQueue: [
      [1, 1],
      [4, 4],
      [2, 2],
      [5, 5],
    ],
  },
  {
    insert: [3, 3],
    expectedPosition: 1,
    expectedLength: 5,
    expectedQueue: [
      [1, 1],
      [3, 3],
      [2, 2],
      [5, 5],
      [4, 4],
    ],
  },
];

export const valid3aryPqInsertions: InsertionCase[] = [
  {
    insert: [5, 5],
    expectedPosition: 0,
    expectedLength: 1,
    expectedQueue: [[5, 5]],
  },
  {
    insert: [1, 1],
    expectedPosition: 0,
    expectedLength: 2,
    expectedQueue: [
      [1, 1],
      [5, 5],
    ],
  },
  {
    insert: [2, 2],
    expectedPosition: 2,
    expectedLength: 3,
    expectedQueue: [
      [1, 1],
      [5, 5],
      [2, 2],
    ],
  },
  {
    insert: [4, 4],
    expectedPosition: 3,
    expectedLength: 4,
    expectedQueue: [
      [1, 1],
      [5, 5],
      [2, 2],
      [4, 4],
    ],
  },
  {
    insert: [3, 3],
    expectedPosition: 1,
    expectedLength: 5,
    expectedQueue: [
      [1, 1],
      [3, 3],
      [2, 2],
      [4, 4],
      [5, 5],
    ],
  },
  {
    insert: [8, 8],
    expectedPosition: 5,
    expectedLength: 6,
    expectedQueue: [
      [1, 1],
      [3, 3],
      [2, 2],
      [4, 4],
      [5, 5],
      [8, 8],
    ],
  },
  {
    insert: [10, 10],
    expectedPosition: 6,
    expectedLength: 7,
    expectedQueue: [
      [1, 1],
      [3, 3],
      [2, 2],
      [4, 4],
      [5, 5],
      [8, 8],
      [10, 10],
    ],
  },
  {
    insert: [0, 0],
    expectedPosition: 0,
    expectedLength: 8,
    expectedQueue: [
      [0, 0],
      [3, 3],
      [1, 1],
      [4, 4],
      [5, 5],
      [8, 8],
      [10, 10],
      [2, 2],
    ],
  },
];

export const deletionResultsBinary = [
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

export const deletionResults3Ary = [
  [
    [1, 1],
    [3, 3],
    [2, 2],
    [4, 4],
    [5, 5],
    [8, 8],
    [10, 10],
  ],
  [
    [2, 2],
    [3, 3],
    [10, 10],
    [4, 4],
    [5, 5],
    [8, 8],
  ],
  [
    [3, 3],
    [5, 5],
    [10, 10],
    [4, 4],
    [8, 8],
  ],
  [
    [4, 4],
    [5, 5],
    [10, 10],
    [8, 8],
  ],
  [
    [5, 5],
    [10, 10],
    [8, 8],
  ],
  [
    [8, 8],
    [10, 10],
  ],
  [[10, 10]],
  [],
];
