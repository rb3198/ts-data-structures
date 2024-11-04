import {
  deletionResults3Ary,
  deletionResultsBinary,
  updateBinaryPriorityTests,
  updateTriaryPriorityTests,
  valid3aryPqInsertions,
  validBinaryPqInsertions,
} from "./cases/priority_queue";
import { PriorityQueue, PriorityQueueFactory } from "../../src/queues";

const verifyHeapProperty = (queue: PriorityQueue<any>) => {
  const { degree } = queue;
  for (let i = 0; i < queue.length(); i++) {
    const [, priority] = queue.queue[i];
    for (let j = degree * i + 1; j <= degree * i + degree; j++) {
      if (j >= queue.length()) {
        break;
      }
      const [, childPriority] = queue.queue[j];
      if (priority > childPriority) {
        return false;
      }
    }
  }
  return true;
};

describe("Tests for pushing and deleting items into the queue -- Binary Heap", () => {
  let queue = PriorityQueueFactory<number>(2);
  it.each(validBinaryPqInsertions)(
    "Should return the number of elements in the queue on insertion",
    (insertion) => {
      const { insert, expectedLength, expectedPosition, expectedQueue } =
        insertion;
      const length = queue.push(insert);
      expect(length).toBe(expectedLength);
      expect(queue.at(expectedPosition)).toEqual(insert);
      expect(queue.queue).toEqual(expectedQueue);
    }
  );

  it("Should maintain the heap property while deleting the minimum element", () => {
    let i = 0;
    while (queue.length()) {
      queue.shift();
      expect(queue.queue).toEqual(deletionResultsBinary[i]);
      i++;
    }
  });
});

describe("Tests for pushing and deleting items into the queue -- Tri-ary Heap", () => {
  let queue = PriorityQueueFactory<number>(3);
  it.each(valid3aryPqInsertions)(
    "Should return the number of elements in the queue on insertion",
    (insertion) => {
      const { insert, expectedLength, expectedPosition, expectedQueue } =
        insertion;
      const length = queue.push(insert);
      expect(length).toBe(expectedLength);
      expect(queue.at(expectedPosition)).toEqual(insert);
      expect(queue.queue).toEqual(expectedQueue);
      expect(verifyHeapProperty(queue)).toBeTruthy();
    }
  );

  it("Should maintain the heap property while deleting the minimum element", () => {
    let i = 0;
    while (queue.length()) {
      queue.shift();
      expect(queue.queue).toEqual(deletionResults3Ary[i]);
      expect(verifyHeapProperty(queue)).toBeTruthy();
      i++;
    }
  });
});

describe("Tests for updating the priority of an element -- Binary Heap", () => {
  it.each(updateBinaryPriorityTests)(
    "Should update the queue maintaining the heap property",
    ({ queueOriginal, updateIdx, updatedPriority, queueUpdated }) => {
      const pq = PriorityQueueFactory<number>(2);
      queueOriginal.forEach((el) => pq.push(el));
      pq.updatePriority(updateIdx, updatedPriority);
      expect(verifyHeapProperty(pq)).toBeTruthy();
      expect(pq.queue).toEqual(queueUpdated);
    }
  );
});

describe("Tests for updating the priority of an element -- Tri-ary Heap", () => {
  it.each(updateTriaryPriorityTests)(
    "Should update the queue maintaining the heap property",
    ({ queueOriginal, updateIdx, updatedPriority, queueUpdated }) => {
      const pq = PriorityQueueFactory<number>(3);
      queueOriginal.forEach((el) => pq.push(el));
      pq.updatePriority(updateIdx, updatedPriority);
      expect(verifyHeapProperty(pq)).toBeTruthy();
      expect(pq.queue).toEqual(queueUpdated);
    }
  );
});

describe("Tests for finding items by priority", () => {
  it.each([2, 3])(
    "Should return the correct index for each of the items searched by priority -- any order",
    (degree) => {
      const queue: [number, number][] = [
        [148, 1],
        [145, 2],
        [143, 3],
        [144, 4],
        [146, 6],
        [147, 5],
        [149, 4],
        [150, 5],
      ];
      const pq = PriorityQueueFactory<number>(degree);
      queue.forEach((el) => pq.push(el));
      expect(pq.findByPriority(1, "any")).toBe(0);
      expect(pq.findByPriority(2, "any")).toBe(1);
      expect(pq.findByPriority(3, "any")).toBe(2);
      expect([3, 6]).toContain(pq.findByPriority(4, "any"));
      expect([5, 7]).toContain(pq.findByPriority(5, "any"));
      expect(pq.findByPriority(6, "any")).toBe(4);
    }
  );

  it.each([2, 3])(
    "Should return the correct index for each of the items searched by priority -- first element",
    (degree) => {
      const queue: [number, number][] = [
        [148, 1],
        [145, 2],
        [143, 3],
        [144, 4],
        [146, 6],
        [147, 5],
        [149, 4],
        [150, 5],
      ];
      const pq = PriorityQueueFactory<number>(degree);
      queue.forEach((el) => pq.push(el));
      expect(pq.findByPriority(1, "first")).toBe(0);
      expect(pq.findByPriority(2, "first")).toBe(1);
      expect(pq.findByPriority(3, "first")).toBe(2);
      expect(pq.findByPriority(4, "first")).toBe(3);
      expect(pq.findByPriority(5, "first")).toBe(5);
      expect(pq.findByPriority(6, "first")).toBe(4);
    }
  );

  it.each([2, 3])(
    "Should return the correct index for each of the items searched by priority -- last element",
    (degree) => {
      const queue: [number, number][] = [
        [148, 1],
        [145, 2],
        [143, 3],
        [144, 4],
        [146, 6],
        [147, 5],
        [149, 4],
        [150, 5],
      ];
      const pq = PriorityQueueFactory<number>(degree);
      queue.forEach((el) => pq.push(el));
      expect(pq.findByPriority(1, "last")).toBe(0);
      expect(pq.findByPriority(2, "last")).toBe(1);
      expect(pq.findByPriority(3, "last")).toBe(2);
      expect(pq.findByPriority(4, "last")).toBe(6);
      expect(pq.findByPriority(5, "last")).toBe(7);
      expect(pq.findByPriority(6, "last")).toBe(4);
    }
  );
});
