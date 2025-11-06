export default class SimpleQueue {
  constructor(arr = []) { this.arr = [...arr]; }
  enqueue(v) { this.arr.push(v); }
  dequeue() { if (this.arr.length) this.arr.shift(); }
  toArray() { return [...this.arr]; }
  clear() { this.arr = []; }
}
