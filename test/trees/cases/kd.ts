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
    ],
    inOrderTraversal: [
      [[1, 7], ""],
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
