export class AVLTree<T> extends SimpleBST<T> {
  private height(node: TreeNode<T> | null): number {
    return node ? node.height : 0;
  }

  getBalance(node: TreeNode<T> | null): number {
    if (!node) return 0;
    return this.height(node.left) - this.height(node.right);
  }

  rotateRight(y: TreeNode<T>): TreeNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

    return x;
  }

  rotateLeft(x: TreeNode<T>): TreeNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

    return y;
  }

  protected override _insert(node: TreeNode<T> | null, v: T): TreeNode<T> {
    if (!node) return this.createNode(v);

    if (v < node.v) node.left = this._insert(node.left, v);
    else if (v > node.v) node.right = this._insert(node.right, v);
    else return node; 

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

    const balance = this.getBalance(node);

    if (balance > 1 && v < node.left!.v) return this.rotateRight(node);

    if (balance < -1 && v > node.right!.v) return this.rotateLeft(node);

    if (balance > 1 && v > node.left!.v) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    if (balance < -1 && v < node.right!.v) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }
}