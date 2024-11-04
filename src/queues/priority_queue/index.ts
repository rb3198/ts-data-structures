/**
 * Class representing a Priority Queue.
 * @param heapDegree Degree of the heap representing the Priority Queue. Defaults to `2`.
 * @returns
 */
export function PriorityQueue<T>(heapDegree: number = 2) {
  const _items: [T, number][] = [];
  const heapifyUp = (idx: number) => {
    let parentIdx = Math.floor((idx - 1) / heapDegree);
    while (parentIdx >= 0 && _items[idx][1] < _items[parentIdx][1]) {
      const temp = _items[idx];
      _items[idx] = _items[parentIdx];
      _items[parentIdx] = temp;
      idx = parentIdx;
      parentIdx = Math.floor((idx - 1) / heapDegree);
    }
  };

  const childIdx = (idx: number, k: number) => heapDegree * idx + k;

  const heapifyDown = () => {
    const item = _items.pop();
    if (!item) {
      return;
    }
    _items.unshift(item);
    let index = 0;
    while (true) {
      let smallest = index;
      for (let k = 1; k <= heapDegree; k++) {
        const currentChildIdx = childIdx(index, k);
        if (currentChildIdx >= _items.length) {
          break;
        }
        if (_items[smallest][1] > _items[currentChildIdx][1]) {
          smallest = currentChildIdx;
        }
      }
      if (smallest === index) break;

      [_items[smallest], _items[index]] = [_items[index], _items[smallest]];
      index = smallest;
    }
  };

  /**
   * Given an index and the updated priority, adjusts the queue to maintain its heap property, in-place.
   * @param idx The existing index of the targeted element.
   * @param newPriority The new priority of the element located at `idx`.
   * @returns The new index of the given element.
   * If an improper index is input to this function (ex: more than the length or less than -1), returns -1.
   */
  const updatePriority = (idx: number, newPriority: number) => {
    if (idx >= _items.length || idx < 0) {
      return -1;
    }
    // heapify up
    let newIdx = idx;
    _items[newIdx][1] = newPriority;
    while (newIdx > 0) {
      let [, priority] = _items[newIdx];
      let parentIdx = Math.floor((newIdx - 1) / heapDegree);
      const [, parentPriority] = _items[parentIdx];
      if (parentPriority > priority) {
        [_items[parentIdx], _items[newIdx]] = [
          _items[newIdx],
          _items[parentIdx],
        ];
        newIdx = parentIdx;
      } else {
        break;
      }
    }
    if (newIdx !== idx) {
      return newIdx;
    }
    // heapify down if element wasn't heapified up (priority decreased)
    while (true) {
      let smallestIdx = newIdx;
      for (let k = 1; k <= heapDegree; k++) {
        const curIdx = childIdx(newIdx, k);
        if (curIdx >= _items.length) {
          break;
        }
        const [, smallestPriority] = _items[smallestIdx];
        const [, childPriority] = _items[curIdx];
        if (smallestPriority > childPriority) {
          smallestIdx = curIdx;
        }
      }
      if (smallestIdx === newIdx) {
        break;
      }

      [_items[smallestIdx], _items[newIdx]] = [
        _items[newIdx],
        _items[smallestIdx],
      ];
      newIdx = smallestIdx;
    }
    return newIdx;
  };

  const queue = {
    push: (itemWithPriority: [T, number]) => {
      _items.push(itemWithPriority);
      heapifyUp(_items.length - 1);
      return _items.length;
    },
    degree: heapDegree,
    min: () => {
      return _items[0];
    },
    at: (index: number) => _items.at(index),
    forEach: _items.forEach,
    includes(searchElement: T, fromIndex?: number) {
      return (
        _items.findIndex((item) => item[0] === searchElement) >=
        (typeof fromIndex === "number" ? fromIndex : 0)
      );
    },
    shift: () => {
      let minPrEl = _items.shift();
      heapifyDown();
      if (minPrEl) {
        return minPrEl[0];
      }
      return minPrEl;
    },
    findIndex: _items.findIndex,
    find: _items.find,
    updatePriority,
    length: () => _items.length,
    queue: _items,
    [Symbol.iterator]: function* () {
      for (let el of _items) {
        yield el;
      }
    },
  };

  return queue;
}
