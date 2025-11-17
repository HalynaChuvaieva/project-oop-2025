const Benchmark = require('benchmark');
const { DoublyLinkedList } = require('collections/list');
const { LinkedList, SimpleQueue, SimpleStack } = require('./my_structures'); 
const N = 10000;
const testData = Array.from({ length: N }, (_, i) => i);
const middleIndex = Math.floor(N / 2);

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
// БЕНЧМАРК СПИСКІВ (ВСТАВКА/ВИДАЛЕННЯ В СЕРЕДИНІ)
// ===============================================

const suiteMiddle = new Benchmark.Suite('LinkedList Middle Operation Benchmarks');

suiteMiddle
.add('My LinkedList Insert At Middle (O(N))', function() {
    const myList = new LinkedList(testData); 
    myList.insert_at(middleIndex, 12345);
})
.add('Lib DoublyLinkedList Insert At Middle (O(N) search + O(1) insert)', function() {
    const libList = new DoublyLinkedList(testData); 
    libList.splice(middleIndex, 0, 12345); 
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

// ===============================================
// BENCHMARK FOR STACK (PUSH/POP)
// ===============================================

const suiteStack = new Benchmark.Suite('Stack Push/Pop Benchmarks');

suiteStack
.add('My SimpleStack Push (O(1))', function() {
    const myStack = new SimpleStack(); 
    for (const v of testData) { myStack.push(v); } 
})
.add('Array Push (JS Native Baseline)', function() {
    const arr = []; 
    for (const v of testData) { arr.push(v); }
});

suiteStack
.add('My SimpleStack Pop (O(1))', function() {
    const myStack = new SimpleStack(testData); 
    for (let i = 0; i < N; i++) { myStack.pop(); } 
})
.add('Array Pop (JS Native Baseline)', function() {
    const arr = [...testData]; 
    for (let i = 0; i < N; i++) { arr.pop(); }
});


console.log('--- STARTING LIST/QUEUE/STACK BENCHMARKS ---');

// List (Start)
suiteList.on('cycle', (e) => console.log(String(e.target)))
         .on('complete', function() { console.log('\n*** Найшвидші тести СПИСКІВ (Початок) ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
         .run({ 'async': false });

// List (Middle)
suiteMiddle.on('cycle', (e) => console.log(String(e.target)))
         .on('complete', function() { console.log('\n*** Найшвидші тести СПИСКІВ (Середина) ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
         .run({ 'async': false });

// Queue
suiteQueue.on('cycle', (e) => console.log(String(e.target)))
          .on('complete', function() { console.log('\n*** Найшвидші тести ЧЕРГИ (Dequeue) ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
          .run({ 'async': false });

// Stack
suiteStack.on('cycle', (e) => console.log(String(e.target)))
          .on('complete', function() { console.log('\n*** Найшвидші тести СТЕКУ (Push/Pop) ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
          .run({ 'async': false });
          
console.log('--- END OF LIST/QUEUE/STACK BENCHMARKS ---');
