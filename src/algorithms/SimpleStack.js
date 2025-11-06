export default class SimpleStack {
  constructor(arr = []) { this.arr = [...arr]; }
  push(v) { this.arr.push(v); }
  pop() { this.arr.pop(); }
  toArray() { return [...this.arr]; }
  clear() { this.arr = []; }
}
