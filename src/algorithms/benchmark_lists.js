const Benchmark = require('benchmark');
const { DoublyLinkedList } = require('collections/list');
const { LinkedList, SimpleQueue, SimpleStack } = require('./my_structures'); 
const N = 10000;
const testData = Array.from({ length: N }, (_, i) => i);

// ===============================================
// BENCHMARK FOR INSERT/REMOVE
// ===============================================

const suiteList = new Benchmark.Suite('LinkedList Benchmarks');

suiteList
.add('My LinkedList Insert At Start (O(N))', function() {
    const myList = new LinkedList(); 
    for (const v of testData) { myList.insert_at(0, v); } 
})
.add('Lib DoublyLinkedList Unshift (O(1))', function() {
    const libList = new DoublyLinkedList(); 
    for (const v of testData) { libList.unshift(v); }
});

suiteList
.add('My LinkedList Remove At Start (O(N))', function() {
    const myList = new LinkedList(testData); 
    for (let i = 0; i < N; i++) { myList.remove_at(0); } 
})
.add('Lib DoublyLinkedList Shift (O(1))', function() {
    const libList = new DoublyLinkedList(testData); 
    for (let i = 0; i < N; i++) { libList.shift(); }
});

// ===============================================
// BENCHMARK FOR DEQUEUE
// ===============================================

const suiteQueue = new Benchmark.Suite('Queue Benchmarks');

suiteQueue
.add('My SimpleQueue Dequeue (O(N))', function() {
    const myQueue = new SimpleQueue(testData); 
    for (let i = 0; i < N; i++) { myQueue.dequeue(); } 
})
.add('Lib DoublyLinkedList Shift (O(1)) [Queue]', function() {
    const libQueue = new DoublyLinkedList(testData); 
    for (let i = 0; i < N; i++) { libQueue.shift(); }
});




console.log('--- STARTING LIST/QUEUE BENCHMARKS ---');
suiteList.on('cycle', (e) => console.log(String(e.target)))
         .on('complete', function() { console.log('\n*** Fastest LISTS tests (Insert/Delete) ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
         .run({ 'async': false });

suiteQueue.on('cycle', (e) => console.log(String(e.target)))
          .on('complete', function() { console.log('\n*** Fastest Dequeue tests ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
          .run({ 'async': false });
console.log('--- END OF LIST/QUEUE BENCHMARKS ---');