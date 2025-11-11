const Benchmark = require('benchmark');
const { BinarySearchTree } = require('js-data-structures');
const { SimpleBST, AVLTree } = require('./my_structures'); 

const N = 10000;
const insertData = Array.from({ length: N }, () => Math.floor(Math.random() * N * 10));

const deleteData = insertData.slice(0, 5000);
function createReadyTree(BSTClass, data) {
    const tree = new BSTClass();
    for (const v of data) {
        tree.insert(v);
    }
    return tree;
}

// ===============================================
// BENCHMARK FOR INSERT
// ===============================================

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

// ===============================================
// BENCHMARK FOR DELETE
// ===============================================

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


console.log('--- STARTING TREE BENCHMARKS ---');
suiteInsert.on('cycle', (e) => console.log(String(e.target)))
           .on('complete', function() { console.log('\n***Fastest tests of INSERTS ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
           .run({ 'async': false });

suiteDelete.on('cycle', (e) => console.log(String(e.target)))
           .on('complete', function() { console.log('\n*** Fastest REMOVAL tests ***'); console.log(this.filter('fastest').map('name')); console.log('---------------------------------'); })
           .run({ 'async': false });
console.log('--- END OF TREE BENCHMARKS ---');