import { deletions, validBinaryPqInsertions } from "./cases/priority_queue";
import { PriorityQueue } from "../../src/queues";

describe("Tests for pushing items into the queue -- Binary Heap", () => {
  let queue = PriorityQueue<number>(2);
  it.each(validBinaryPqInsertions)(
    "Should return the number of elements in the queue on insertion",
    (insertion) => {
      const { insert, expectedLength, expectedPosition } = insertion;
      const length = queue.push(insert);
      expect(length).toBe(expectedLength);
      expect(queue.at(expectedPosition)).toEqual(insert);
    }
  );

  it("Should maintain the heap property while deleting the minimum element", () => {
    let i = 0;
    while (queue.length) {
      queue.shift();
      expect(queue).toEqual(deletions[i]);
      i++;
    }
  });
});
