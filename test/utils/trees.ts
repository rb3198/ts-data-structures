import { Node as KDNode } from "../../src/trees/kd/Node";

/**
 * Verifies if the KD-Tree property is maintained throughout the tree.
 * @param root
 * @param k
 * @param depth
 * @returns
 */
export const verifyKdTreeProperty = <V>(
  k: number,
  depth: number,
  root?: KDNode<V> | null
) => {
  if (!root) {
    return true;
  }
  const { key } = root;
  const d = depth % k;
  if (root.left) {
    const { key: leftKey } = root.left;
    expect(leftKey[d]).toBeLessThan(key[d]);
    verifyKdTreeProperty(k, depth + 1, root.left);
  }
  if (root.right) {
    const { key: rightKey } = root.right;
    expect(rightKey[d]).toBeGreaterThanOrEqual(key[d]);
    verifyKdTreeProperty(k, depth + 1, root.right);
  }
  return true;
};
