export default class SimpleQueue {
  constructor(arr = []) { this.arr = [...arr]; }
  enqueue(v) { this.arr.push(v); }
  dequeue() { if (this.arr.length) this.arr.shift(); }
  toArray() { return [...this.arr]; }
  clear() { this.arr = []; }

  peek() { return this.isEmpty() ? null : this.arr[0]; }
  front() { return this.peek(); } 
  isEmpty() { return this.arr.length === 0; }
  size() { return this.arr.length; }
}
