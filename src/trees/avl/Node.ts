export class Node<K, V> {
  height: number = 1;
  data: V;
  key: K;
  left?: Node<K, V> | null;
  right?: Node<K, V> | null;
  constructor(key: K, data: V) {
    this.key = key;
    this.data = data;
    this.height = 1;
  }
}
