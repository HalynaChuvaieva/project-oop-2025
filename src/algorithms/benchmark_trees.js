/**
 * @file tree_benchmarks.js
 * @brief Benchmarking script that compares performance of SimpleBST, AVLTree, and js-data-structures BST.
 * 
 * This script performs benchmarks for:
 * - insertion
 * - deletion
 * - search
 * - inorder traversal
 * 
 * @note Uses the 'benchmark' npm library.
 * @example
 *    node tree_benchmarks.js
 */

const Benchmark = require('benchmark');
const { BinarySearchTree } = require('js-data-structures');
const { SimpleBST, AVLTree } = require('./my_structures'); 
const N = 10000;
const insertData = Array.from({ length: N }, () => Math.floor(Math.random() * N * 10));
const deleteData = insertData.slice(0, 5000);

/**
 * @brief Creates a tree of a specific class and pre-fills it with data.
 * 
 * @param {Function} BSTClass - Tree class constructor (SimpleBST, AVLTree, or library BST).
 * @param {Array<number>} data - Values to insert before running the benchmark.
 * @return {Object} A fully constructed tree instance.
 * 
 * @example
 * const tree = createReadyTree(SimpleBST, [1, 5, 7]);
 */
function createReadyTree(BSTClass, data) {
    const tree = new BSTClass();
    for (const v of data) {
        tree.insert(v);
    }
    return tree;
}

// ======================================================
// INSERT BENCHMARK
// ======================================================

/**
 * @brief Benchmark suite that evaluates insertion speed.
 */
const suiteInsert = new Benchmark.Suite('Tree Insert Benchmarks');

suiteInsert
.add('My SimpleBST Insert', function() {
    const tree = new SimpleBST();
    for (const v of insertData) { tree.insert(v); }
})
.add('My AVLTree Insert', function() {
    const tree = new AVLTree();
    for (const v of insertData) { tree.insert(v); }
})
.add('js-data-structures BST Insert', function() {
    const libTree = new BinarySearchTree();
    for (const v of insertData) { libTree.insert(v); }
});

// ======================================================
// DELETE BENCHMARK
// ======================================================

/**
 * @brief Benchmark suite that evaluates deletion speed.
 */
const suiteDelete = new Benchmark.Suite('Tree Delete Benchmarks');

suiteDelete
.add('My SimpleBST Delete', function() {
    const tree = createReadyTree(SimpleBST, insertData); 
    for (const v of deleteData) { tree.deleteNode(v); }
})
.add('My AVLTree Delete', function() {
    const tree = createReadyTree(AVLTree, insertData); 
    for (const v of deleteData) { tree.deleteNode(v); } 
})
.add('js-data-structures BST Delete', function() {
    const libTree = createReadyTree(BinarySearchTree, insertData); 
    for (const v of deleteData) { libTree.remove(v); }
});

// ======================================================
// SEARCH BENCHMARK
// ======================================================

/**
 * @brief Benchmark suite testing search performance.
 * @note Assumes all tree classes implement .search().
 */
const suiteSearch = new Benchmark.Suite('Tree Search Benchmarks');

suiteSearch
.add('My SimpleBST Search', function() {
    for (const v of searchData) { myBST.search(v); }
})
.add('My AVLTree Search', function() {
    for (const v of searchData) { myAVL.search(v); }
})
.add('js-data-structures BST Search', function() {
    for (const v of searchData) { libBST.search(v); }
});

// ======================================================
// INORDER TRAVERSAL BENCHMARK
// ======================================================

/**
 * @brief Benchmark suite testing inorder traversal speed.
 */
const suiteTraversal = new Benchmark.Suite('Tree Traversal Benchmarks');

suiteTraversal
.add('My SimpleBST Inorder', function() {
    myBST.inorder();
})
.add('My AVLTree Inorder', function() {
    myAVL.inorder();
})
.add('js-data-structures BST Inorder', function() {
    libBST.inorder(); 
});

// ======================================================
// RUNNING ALL BENCHMARKS
// ======================================================

console.log('--- STARTING TREE BENCHMARKS ---');

suiteInsert
  .on('cycle', (e) => console.log(String(e.target)))
  .on('complete', function() {
      console.log('\n*** Найшвидші тести ВСТАВКИ ***');
      console.log(this.filter('fastest').map('name'));
      console.log('---------------------------------');
  })
  .run({ async: false });

suiteSearch
  .on('cycle', (e) => console.log(String(e.target)))
  .on('complete', function() {
      console.log('\n*** Найшвидші тести ПОШУКУ ***');
      console.log(this.filter('fastest').map('name'));
      console.log('---------------------------------');
  })
  .run({ async: false });

suiteTraversal
  .on('cycle', (e) => console.log(String(e.target)))
  .on('complete', function() {
      console.log('\n*** Найшвидші тести ОБХОДУ ***');
      console.log(this.filter('fastest').map('name'));
      console.log('---------------------------------');
  })
  .run({ async: false });

suiteDelete
  .on('cycle', (e) => console.log(String(e.target)))
  .on('complete', function() {
      console.log('\n*** Найшвидші тести ВИДАЛЕННЯ ***');
      console.log(this.filter('fastest').map('name'));
      console.log('---------------------------------');
  })
  .run({ async: false });

console.log('--- END OF TREE BENCHMARKS ---');
