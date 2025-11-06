export default class LinkedList {
  constructor(arr = []) { this.arr = [...arr]; }
  insert_at(idx, value) {
    if (idx < 0) idx = 0;
    if (idx > this.arr.length) idx = this.arr.length;
    this.arr.splice(idx, 0, value);
  }
  remove_at(idx) { if (idx < 0 || idx >= this.arr.length) return; this.arr.splice(idx, 1); }
  clear() { this.arr = []; }
  toArray() { return [...this.arr]; }
}
