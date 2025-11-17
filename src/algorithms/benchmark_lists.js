/**
 * @file benchmark_list.js
 * @brief Benchmarks for LinkedList, Queue, and Stack operations.
 *
 * @details
 * This file compares performance of:
 *  - Custom LinkedList vs DoublyLinkedList (from collections/list)
 *  - Custom SimpleQueue vs DoublyLinkedList used as queue
 *  - Custom SimpleStack vs native JS Array
 *
 * @note Uses Benchmark.js to run tests synchronously.
 */

const Benchmark = require('benchmark');
const { DoublyLinkedList } = require('collections/list');
const { LinkedList, SimpleQueue, SimpleStack } = require('./my_structures'); 

/**
 * @brief Number of test operations.
 */
const N = 10000;

/**
 * @brief Array with test values.
 */
const testData = Array.from({ length: N }, (_, i) => i);

/**
 * @brief Middle index in the list for testing O(N) insertion/removal.
 */
const middleIndex = Math.floor(N / 2);


// ======================================================
// =============== BENCHMARK: INSERT/REMOVE ==============
// ======================================================

/**
 * @brief Benchmark suite for list operations at the start (insert/remove).
 */
const suiteList = new Benchmark.Suite('LinkedList Benchmarks');


/**
 * @brief Benchmark: Insert at start in custom LinkedList.
 * @details O(N²) total because insert at index 0 is O(N) each.
 *
 * @example
 * const list = new LinkedList();
 * list.insert_at(0, 5); // Inserts at head
 */
suiteList.add('My LinkedList Insert At Start (O(N))', function() {
    const myList = new LinkedList(); 
    for (const v of testData) { myList.insert_at(0, v); } 
});


/**
 * @brief Benchmark: Unshift in DoublyLinkedList library.
 * @details O(1) amortized.
 *
 * @example
 * const list = new DoublyLinkedList();
 * list.unshift(42);
 */
suiteList.add('Lib DoublyLinkedList Unshift (O(1))', function() {
    const libList = new DoublyLinkedList(); 
    for (const v of testData) { libList.unshift(v); }
});


/**
 * @brief Benchmark: Removal at start in custom LinkedList.
 * @details Removing from index 0 is O(N), repeated N times → O(N²).
 *
 * @example
 * const list = new LinkedList([1,2,3]);
 * list.remove_at(0); // removes head
 */
suiteList.add('My LinkedList Remove At Start (O(N))', function() {
    const myList = new LinkedList(testData); 
    for (let i = 0; i < N; i++) { myList.remove_at(0); } 
});


/**
 * @brief Benchmark: Shift in library DoublyLinkedList.
 * @details O(1).
 *
 * @example
 * const list = new DoublyLinkedList([1,2,3]);
 * list.shift();
 */
suiteList.add('Lib DoublyLinkedList Shift (O(1))', function() {
    const libList = new DoublyLinkedList(testData); 
    for (let i = 0; i < N; i++) { libList.shift(); }
});


// ======================================================
// ===== BENCHMARK: INSERT/REMOVE IN THE MIDDLE =========
// ======================================================

/**
 * @brief Benchmark suite for insertion/removal in the middle of lists.
 */
const suiteMiddle = new Benchmark.Suite('LinkedList Middle Operation Benchmarks');


/**
 * @brief Benchmark: Insert at middle in custom LinkedList.
 * @details Searching for index O(N), inserting O(1).
 *
 * @example
 * const list = new LinkedList([1,2,3]);
 * list.insert_at(1, 999);
 */
suiteMiddle.add('My LinkedList Insert At Middle (O(N))', function() {
    const myList = new LinkedList(testData); 
    myList.insert_at(middleIndex, 12345);
});


/**
 * @brief Benchmark: Insert at middle in library DoublyLinkedList.
 * @details Splice requires O(N) to find index, insertion O(1).
 *
 * @example
 * const list = new DoublyLinkedList([1,2,3]);
 * list.splice(1, 0, 500);
 */
suiteMiddle.add('Lib DoublyLinkedList Insert At Middle (O(N) search + O(1) insert)', function() {
    const libList = new DoublyLinkedList(testData); 
    libList.splice(middleIndex, 0, 12345); 
});


// ======================================================
// =============== BENCHMARK: QUEUE ======================
// ======================================================

/**
 * @brief Benchmark suite for queue operations.
 */
const suiteQueue = new Benchmark.Suite('Queue Benchmarks');


/**
 * @brief Benchmark: Dequeue in custom SimpleQueue.
 * @details Implemented as array shift → O(N).
 *
 * @example
 * const q = new SimpleQueue([1,2,3]);
 * q.dequeue();
 */
suiteQueue.add('My SimpleQueue Dequeue (O(N))', function() {
    const myQueue = new SimpleQueue(testData); 
    for (let i = 0; i < N; i++) { myQueue.dequeue(); } 
});


/**
 * @brief Benchmark: Using DoublyLinkedList as a queue.
 * @details shift() is O(1).
 *
 * @example
 * const q = new DoublyLinkedList([1,2,3]);
 * q.shift();
 */
suiteQueue.add('Lib DoublyLinkedList Shift (O(1)) [Queue]', function() {
    const libQueue = new DoublyLinkedList(testData); 
    for (let i = 0; i < N; i++) { libQueue.shift(); }
});


// ======================================================
// =============== BENCHMARK: STACK ======================
// ======================================================

/**
 * @brief Benchmark suite for stack operations (push/pop).
 */
const suiteStack = new Benchmark.Suite('Stack Push/Pop Benchmarks');


/**
 * @brief Benchmark: Push in custom SimpleStack.
 *
 * @example
 * const s = new SimpleStack();
 * s.push(10);
 */
suiteStack.add('My SimpleStack Push (O(1))', function() {
    const myStack = new SimpleStack(); 
    for (const v of testData) { myStack.push(v); } 
});


/**
 * @brief Benchmark: Push on JS native array.
 *
 * @example
 * const arr = [];
 * arr.push(5);
 */
suiteStack.add('Array Push (JS Native Baseline)', function() {
    const arr = []; 
    for (const v of testData) { arr.push(v); }
});


/**
 * @brief Benchmark: Pop in custom SimpleStack.
 *
 * @example
 * const s = new SimpleStack([1,2,3]);
 * s.pop();
 */
suiteStack.add('My SimpleStack Pop (O(1))', function() {
    const myStack = new SimpleStack(testData); 
    for (let i = 0; i < N; i++) { myStack.pop(); } 
});


/**
 * @brief Benchmark: Pop on JS native array.
 *
 * @example
 * const arr = [1,2,3];
 * arr.pop();
 */
suiteStack.add('Array Pop (JS Native Baseline)', function() {
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
