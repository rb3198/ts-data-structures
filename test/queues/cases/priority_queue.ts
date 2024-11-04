type InsertionCase = {
  insert: [number, number];
  expectedPosition: number;
  expectedLength: number;
  expectedQueue: [number, number][];
};

type UpdateCase = {
  queueOriginal: [number, number][];
  updateIdx: number;
  updatedPriority: number;
  queueUpdated: [number, number][];
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
    [8, 8],
    [10, 10],
  ],
  [
    [8, 8],
    [10, 10],
  ],
  [[10, 10]],
  [],
];

export const updateBinaryPriorityTests: UpdateCase[] = [
  {
    queueOriginal: [
      [2, 1],
      [1, 2],
      [3, 4],
      [4, 5],
      [5, 3],
      [6, 6],
      [7, 7],
      [8, 10],
    ],
    updateIdx: 3,
    updatedPriority: 0,
    queueUpdated: [
      [4, 0],
      [2, 1],
      [3, 4],
      [1, 2],
      [5, 3],
      [6, 6],
      [7, 7],
      [8, 10],
    ],
  },
  {
    queueOriginal: [
      [41, 1],
      [43, 2],
      [39, 3],
      [40, 4],
      [42, 5],
      [44, 6],
      [45, 4],
    ],
    updateIdx: 5,
    updatedPriority: 0,
    queueUpdated: [
      [44, 0],
      [43, 2],
      [41, 1],
      [40, 4],
      [42, 5],
      [39, 3],
      [45, 4],
    ],
  },
  {
    queueOriginal: [
      [10, 1],
      [12, 4],
      [13, 3],
      [11, 6],
      [9, 5],
      [14, 7],
      [15, 5],
    ],
    updateIdx: 6,
    updatedPriority: 4,
    queueUpdated: [
      [10, 1],
      [12, 4],
      [13, 3],
      [11, 6],
      [9, 5],
      [14, 7],
      [15, 4],
    ],
  },
  {
    queueOriginal: [
      [17, 1],
      [16, 4],
      [18, 5],
      [19, 6],
      [20, 7],
      [21, 6],
      [22, 7],
    ],
    updateIdx: 1,
    updatedPriority: 8,
    queueUpdated: [
      [17, 1],
      [19, 6],
      [18, 5],
      [16, 8],
      [20, 7],
      [21, 6],
      [22, 7],
    ],
  },
  {
    queueOriginal: [
      [25, 2],
      [24, 3],
      [23, 5],
      [26, 4],
      [27, 5],
      [28, 6],
      [29, 8],
      [30, 5],
    ],
    updateIdx: 0,
    updatedPriority: 8,
    queueUpdated: [
      [24, 3],
      [26, 4],
      [23, 5],
      [30, 5],
      [27, 5],
      [28, 6],
      [29, 8],
      [25, 8],
    ],
  },
  {
    queueOriginal: [
      [36, 1],
      [31, 2],
      [34, 3],
      [33, 4],
      [32, 6],
      [35, 5],
      [37, 4],
      [38, 8],
    ],
    updateIdx: 7,
    updatedPriority: 12,
    queueUpdated: [
      [36, 1],
      [31, 2],
      [34, 3],
      [33, 4],
      [32, 6],
      [35, 5],
      [37, 4],
      [38, 12],
    ],
  },
];

export const updateTriaryPriorityTests: UpdateCase[] = [
  {
    queueOriginal: [
      [36, 1],
      [31, 2],
      [34, 3],
      [33, 4],
      [32, 6],
      [35, 5],
      [37, 4],
      [38, 8],
    ],
    updateIdx: 7,
    updatedPriority: 0,
    queueUpdated: [
      [38, 0],
      [31, 2],
      [36, 1],
      [33, 4],
      [32, 6],
      [35, 5],
      [37, 4],
      [34, 3],
    ],
  },
  {
    queueOriginal: [
      [36, 1],
      [31, 2],
      [34, 3],
      [33, 4],
      [32, 6],
      [35, 5],
      [37, 4],
      [38, 8],
    ],
    updateIdx: 0,
    updatedPriority: 10,
    queueUpdated: [
      [31, 2],
      [37, 4],
      [34, 3],
      [33, 4],
      [32, 6],
      [35, 5],
      [36, 10],
      [38, 8],
    ],
  },
  {
    queueOriginal: [
      [148, 1],
      [145, 2],
      [143, 3],
      [144, 4],
      [146, 6],
      [147, 5],
      [149, 3],
      [150, 4],
    ],
    updateIdx: 2,
    updatedPriority: 10,
    queueUpdated: [
      [148, 1],
      [145, 2],
      [150, 4],
      [144, 4],
      [146, 6],
      [147, 5],
      [149, 3],
      [143, 10],
    ],
  },
  {
    queueOriginal: [
      [148, 1],
      [145, 2],
      [143, 3],
      [144, 4],
      [146, 6],
      [147, 5],
      [149, 3],
      [150, 4],
    ],
    updateIdx: 2,
    updatedPriority: 0,
    queueUpdated: [
      [143, 0],
      [145, 2],
      [148, 1],
      [144, 4],
      [146, 6],
      [147, 5],
      [149, 3],
      [150, 4],
    ],
  },
];
