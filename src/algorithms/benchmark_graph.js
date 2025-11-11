const Benchmark = require('benchmark');
const Graphology = require('graphology');
const { bfs, dfs } = require('graphology-traversal');
const dijkstraGraphology = require('graphology-shortest-path/dijkstra').bidirectional;
const JGraph = require('js-graph-algorithms');
const { Graph, WeightedGraph, NegativeWeightedGraph, DirectedGraph } = require('./my_structures');

// ===============================================
// SETTING DATA FOR TESTS
// ===============================================

const VERTICES_COUNT = 200;
const EDGES_COUNT = 1500;
const startNode = 0;
const targetNode = VERTICES_COUNT - 1;

const vertices = Array.from({ length: VERTICES_COUNT }, (_, i) => i);
const edges = Array.from({ length: EDGES_COUNT }, () => [
    Math.floor(Math.random() * VERTICES_COUNT),
    Math.floor(Math.random() * VERTICES_COUNT),
    Math.random() * 10 
]);

function buildGraphology() {
    const libGraph = new Graphology.Graph({ type: 'undirected' });
    for (const v of vertices) {
        libGraph.addNode(v);
    }
    for (const [u, v, w] of edges) {
        if (u !== v && !libGraph.hasEdge(u, v)) {
            libGraph.addEdge(u, v, { weight: w });
        }
    }
    return libGraph;
}

function buildJGraph(useNegative = false) {
    const jGraph = new JGraph.WeightedGraph(VERTICES_COUNT);
    for (const [u, v, w] of edges) {
        const weight = useNegative ? w * (Math.random() > 0.8 ? -1 : 1) : w;
        jGraph.addEdge(u, v, weight);
    }
    return jGraph;
}

// ===============================================
// BENCHMARK FOR BFS, DFS
// ===============================================

const libGraphology = buildGraphology();
const suiteTraversal = new Benchmark.Suite('Traversal Benchmarks (BFS, DFS)');

suiteTraversal
.add('My Graph BFS', function() {
    const myGraph = new Graph(vertices);
    for (const [u, v] of edges) myGraph.addEdge(u, v);
    myGraph.bfs(startNode);
})
.add('Graphology BFS', function() {
    let count = 0;
    bfs(libGraphology, startNode, () => { count++; });
})
.add('My DirectedGraph DFS', function() {
    const myDGraph = new DirectedGraph(vertices);
    for (const [u, v] of edges) myDGraph.addEdge(u, v);
    myDGraph.dfs(startNode);
})
.add('Graphology DFS', function() {
    let count = 0;
    dfs(libGraphology, startNode, () => { count++; });
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('\n*** Fastest search tests ***');
    console.log(this.filter('fastest').map('name'));
    console.log('---------------------------------');
})

// ===============================================
// BENCHMARK FOR DIJKSTRA
// ===============================================

const suiteDijkstra = new Benchmark.Suite('Dijkstra Benchmarks');

suiteDijkstra
.add('My WeightedGraph Dijkstra', function() {
    const myWGraph = new WeightedGraph(vertices);
    for (const [u, v, w] of edges) myWGraph.addUndirectedEdge(u, v, w);
    myWGraph.dijkstra(startNode);
})
.add('Graphology Dijkstra', function() {
    dijkstraGraphology(libGraphology, startNode, targetNode);
})
.add('JGraph Dijkstra', function() {
    const jGraph = buildJGraph();
    const dijkstra = new JGraph.Dijkstra(jGraph, startNode);
    dijkstra.distTo(targetNode);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('\n*** Fastest Dijkstra tests ***');
    console.log(this.filter('fastest').map('name'));
    console.log('---------------------------------');
})

// ===============================================
// BENCHMARK FOR BELLMAN FORD
// ===============================================

const NEGATIVE_EDGES = Array.from({ length: EDGES_COUNT }, () => [
    Math.floor(Math.random() * VERTICES_COUNT),
    Math.floor(Math.random() * VERTICES_COUNT),
    (Math.random() - 0.5) * 20 
]);

const suiteBellmanFord = new Benchmark.Suite('Bellman-Ford Benchmarks');

suiteBellmanFord
.add('My NegativeWeightedGraph BellmanFord', function() {
    const myNWGraph = new NegativeWeightedGraph(vertices);
    for (const [u, v, w] of NEGATIVE_EDGES) myNWGraph.addEdge(u, v, w);
    try {
        myNWGraph.BellmanFord(startNode);
    } catch (e) {
    }
})
.add('JGraph Bellman-Ford', function() {
    const jGraph = buildJGraph(true); 
    const bellman = new JGraph.BellmanFord(jGraph, startNode);
    bellman.distTo(targetNode);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.on('complete', function() {
    console.log('\n*** Fastest Bellman Ford tests ***');
    console.log(this.filter('fastest').map('name'));
    console.log('---------------------------------');
})


console.log('--- STARTING GRAPH BENCHMARKS ---');
suiteTraversal.run({ 'async': false });
suiteDijkstra.run({ 'async': false });
suiteBellmanFord.run({ 'async': false });
console.log('--- END OF GRAPH BENCHMARKS ---');