export class BalancedBST<T> extends SimpleBST<T> {
  getHeight(node: TreeNode<T> | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }
}