export default class SimpleBST<T> {
  private root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  private createNode(v: T): TreeNode<T> {
    return { v, left: null, right: null };
  }

  insert(v: T): void {
    const node = this.createNode(v);

    if (!this.root) {
      this.root = node;
      return;
    }

    let cur = this.root;
    while (true) {
      if (v < cur.v) {
        if (!cur.left) {
          cur.left = node;
          return;
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node;
          return;
        }
        cur = cur.right;
      }
    }
  }

  private _inorder(node: TreeNode<T> | null, out: T[]): void {
    if (!node) return;
    this._inorder(node.left, out);
    out.push(node.v);
    this._inorder(node.right, out);
  }

  inorder(): T[] {
    const out: T[] = [];
    this._inorder(this.root, out);
    return out;
  }

  minValue(node: TreeNode<T> | null): T | null {
    if (!node) return null;
    let current = node;
    while (current.left) current = current.left;
    return current.v;
  }

  private _deleteNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (!node) return null;

    if (value < node.v) {
      node.left = this._deleteNode(node.left, value);
    } else if (value > node.v) {
      node.right = this._deleteNode(node.right, value);
    } else {
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right; 
      if (!node.right) return node.left; 

      const minVal = this.minValue(node.right);
      node.v = minVal!;
      node.right = this._deleteNode(node.right, minVal!);
    }
    return node;
  }

  deleteNode(value: T): void {
    this.root = this._deleteNode(this.root, value);
  }

  clear(): void {
    this.root = null;
  }
}

interface TreeNode<T> {
  v: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}
