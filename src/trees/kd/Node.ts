export class Node<V> {
  data: V;
  key: number[];
  left?: Node<V> | null;
  right?: Node<V> | null;
  constructor(key: number[], data: V) {
    this.key = key;
    this.data = data;
  }
}
