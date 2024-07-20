export const insertionTests2d = [
  {
    inserts: [
      {
        key: [10, 5],
        value: "",
      },
      {
        key: [7, 8],
        value: "",
      },
      {
        key: [1, 7],
        value: "",
      },
      {
        key: [12, 1],
        value: "",
      },
      {
        key: [11, 0],
        value: "",
      },
      {
        key: [10, 7],
        value: "",
      },
      {
        key: [11, 3],
        value: "",
      },
      {
        key: [10, 8],
        value: "",
      },
      {
        key: [5, 7],
        value: "",
      },
    ],
    inOrderTraversal: [
      [[1, 7], ""],
      [[5, 7], ""],
      [[7, 8], ""],
      [[10, 5], ""],
      [[11, 0], ""],
      [[12, 1], ""],
      [[10, 7], ""],
      [[11, 3], ""],
      [[10, 8], ""],
    ],
  },
  {
    inserts: [
      {
        key: [30, 15],
        value: "A",
      },
      {
        key: [15, 7.5],
        value: "B",
      },
      {
        key: [7.5, 15],
        value: "C",
      },
      {
        key: [45, 7.5],
        value: "D",
      },
      {
        key: [30, 10],
        value: "E",
      },
      {
        key: [7.5, 3],
        value: "F",
      },
      {
        key: [3, 30],
        value: "G",
      },
      {
        key: [7.5, 30],
        value: "H",
      },
    ],
    inOrderTraversal: [
      [[7.5, 3], "F"],
      [[15, 7.5], "B"],
      [[3, 30], "G"],
      [[7.5, 15], "C"],
      [[7.5, 30], "H"],
      [[30, 15], "A"],
      [[45, 7.5], "D"],
      [[30, 10], "E"],
    ],
  },
];

export const insertionTests3d = [
  {
    inserts: [
      { key: [30, 15, 10], value: "A" },
      { key: [15, 15, 30], value: "B" },
      { key: [20, 10, 30], value: "C" },
      { key: [20, 10, 10], value: "D" },
      { key: [20, 20, 20], value: "E" },
      { key: [20, 10, 45], value: "F" },
      { key: [20, 20, 10], value: "G" },
      { key: [20, 20, 25], value: "I" },
      { key: [45, 10, 10], value: "J" },
      { key: [30, 5, 10], value: "K" },
      { key: [30, 15, 8], value: "L" },
    ],
    inOrderTraversal: [
      [[20, 10, 10], "D"],
      [[20, 10, 30], "C"],
      [[20, 10, 45], "F"],
      [[15, 15, 30], "B"],
      [[20, 20, 10], "G"],
      [[20, 20, 20], "E"],
      [[20, 20, 25], "I"],
      [[30, 15, 10], "A"],
      [[30, 5, 10], "K"],
      [[45, 10, 10], "J"],
      [[30, 15, 8], "L"],
    ],
  },
];

export const improperKeyLengthInsertions: {
  k: number;
  insert: [number[], string];
}[] = [
  {
    k: 2,
    insert: [[1, 2, 3], "A"],
  },
  {
    k: 3,
    insert: [[1, 2], "A"],
  },
];

export const imbalancedInsertions2d = [
  {
    inserts: [
      {
        key: [5, 10],
        value: "A",
      },
      {
        key: [10, 20],
        value: "B",
      },
      {
        key: [6, 10],
        value: "C",
      },
      {
        key: [6, 21],
        value: "D",
      },
      {
        key: [10, 16],
        value: "E",
      },
      {
        key: [7, 15],
        value: "F",
      },
    ],
    initialInOrderTraversal: [
      [[5, 10], "A"],
      [[6, 10], "C"],
      [[7, 15], "F"],
      [[10, 16], "E"],
      [[10, 20], "B"],
      [[6, 21], "D"],
    ],
    postBalancingTraversal: [
      [[6, 10], "C"],
      [[5, 10], "A"],
      [[6, 21], "D"],
      [[7, 15], "F"],
      [[10, 16], "E"],
      [[10, 20], "B"],
    ],
  },
  {
    inserts: [
      {
        key: [10, 15],
        value: "A",
      },
      {
        key: [5, 15],
        value: "B",
      },
      {
        key: [6, 10],
        value: "C",
      },
      {
        key: [3, 14],
        value: "D",
      },
      {
        key: [6, 15],
        value: "E",
      },
      {
        key: [5, 13],
        value: "F",
      },
    ],
    initialInOrderTraversal: [
      [[5, 13], "F"],
      [[3, 14], "D"],
      [[6, 10], "C"],
      [[5, 15], "B"],
      [[6, 15], "E"],
      [[10, 15], "A"],
    ],
    postBalancingTraversal: [
      [[5, 13], "F"],
      [[3, 14], "D"],
      [[5, 15], "B"],
      [[6, 15], "E"],
      [[6, 10], "C"],
      [[10, 15], "A"],
    ],
  },
];

export const imbalancedInsertions3d = [
  {
    inserts: [
      {
        key: [30, 15, 10],
        value: "A",
      },
      {
        key: [15, 15, 30],
        value: "B",
      },
      {
        key: [45, 10, 10],
        value: "C",
      },
      {
        key: [20, 10, 30],
        value: "D",
      },
      {
        key: [20, 10, 10],
        value: "E",
      },
      {
        key: [15, 12, 15],
        value: "F",
      },
    ],
    initialInOrderTraversal: [
      [[15, 12, 15], "F"],
      [[20, 10, 10], "E"],
      [[20, 10, 30], "D"],
      [[15, 15, 30], "B"],
      [[30, 15, 10], "A"],
      [[45, 10, 10], "C"],
    ],
    postBalancingTraversal: [
      [[15, 12, 15], "F"],
      [[15, 15, 30], "B"],
      [[20, 10, 30], "D"],
      [[45, 10, 10], "C"],
      [[20, 10, 10], "E"],
      [[30, 15, 10], "A"],
    ],
  },
];

export const searchClosestTests2d = {
  inserts: insertionTests2d[0].inserts,
  tests: [
    {
      testPoint: [0, 0],
      expected: [1, 7],
    },
    {
      testPoint: [11, 6],
      expected: [10, 7],
    },
    {
      testPoint: [10, 5],
      expected: [10, 5],
    },
    {
      testPoint: [12, 1],
      expected: [12, 1],
    },
    {
      testPoint: [11, 8],
      expected: [10, 8],
    },
  ],
};
export const searchClosestTests3d = [];

const getRect = (low: number[], high: number[]) => {
  return {
    low,
    high,
    getMinCoord: function (axis: number) {
      return this.low[axis];
    },
    getMaxCoord: function (axis: number) {
      return this.high[axis];
    },
    isWithinBounds: function (point: number[]) {
      for (let i = 0; i < point.length; i++) {
        if (point[i] < this.low[i] || point[i] > this.high[i]) {
          return false;
        }
      }
      return true;
    },
  };
};

export const searchRangeTests2d = [
  {
    inserts: insertionTests2d[0].inserts,
    rect: getRect([0, 0], [7, 7]),
    expectedOutput: [
      [[1, 7], ""],
      [[5, 7], ""],
    ],
  },
  {
    inserts: insertionTests2d[0].inserts,
    rect: getRect([0, 0], [10, 10]),
    expectedOutput: [
      [[10, 5], ""],
      [[7, 8], ""],
      [[1, 7], ""],
      [[5, 7], ""],
      [[10, 7], ""],
      [[10, 8], ""],
    ],
  },
  {
    inserts: insertionTests2d[0].inserts,
    rect: getRect([10, 5], [12, 10]),
    expectedOutput: [
      [[10, 5], ""],
      [[10, 7], ""],
      [[10, 8], ""],
    ],
  },
  {
    inserts: insertionTests2d[0].inserts,
    rect: getRect([11, 4], [12, 8]),
    expectedOutput: [],
  },
];

export const searchRangeTests3d = [
  {
    inserts: insertionTests3d[0].inserts,
    cube: getRect([20, 10, 10], [40, 20, 30]),
    expectedOutput: [
      [[30, 15, 10], "A"],
      [[20, 10, 30], "C"],
      [[20, 10, 10], "D"],
      [[20, 20, 20], "E"],
      [[20, 20, 10], "G"],
      [[20, 20, 25], "I"],
    ],
  },
  {
    inserts: insertionTests3d[0].inserts,
    cube: getRect([30, 5, 0], [40, 15, 10]),
    expectedOutput: [
      [[30, 15, 10], "A"],
      [[30, 5, 10], "K"],
      [[30, 15, 8], "L"],
    ],
  },
  {
    inserts: insertionTests3d[0].inserts,
    cube: getRect([30, 20, 0], [40, 40, 40]),
    expectedOutput: [],
  },
];
