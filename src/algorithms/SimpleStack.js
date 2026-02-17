export default class SimpleStack {
  constructor(arr = []) { this.arr = [...arr]; }
  push(v) { this.arr.push(v); }
  pop() { this.arr.pop(); }
  toArray() { return [...this.arr]; }
  clear() { this.arr = []; }

  peek() { return this.isEmpty() ? null : this.arr[this.arr.length - 1]; }
  isEmpty() { return this.arr.length === 0; }
  size() { return this.arr.length; }
}
