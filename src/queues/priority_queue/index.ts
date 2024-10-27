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
  const queue = {
    push: (itemWithPriority: [T, number]) => {
      console.log("inserted", itemWithPriority[1]);
      _items.push(itemWithPriority);
      heapifyUp(_items.length - 1);
      return _items.length;
    },
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
    queue: _items,
  };
  return queue;
}
