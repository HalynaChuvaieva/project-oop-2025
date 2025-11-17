/**
 * @file benchmark_graph.js
 * @brief Benchmark tests for BFS, DFS, Dijkstra, and Bellman-Ford
 *        comparing custom graph structures with Graphology and js-graph-algorithms.
 */
/**
 * @brief Builds an undirected Graphology graph with random edges.
 *
 * @example
 * // Example: create graphology graph and run BFS
 * const graph = buildGraphology();
 * bfs(graph, 0, node => console.log(node));
 *
 * @return {Graphology.Graph} Constructed graph.
 *
 * @note Skips self-loops and duplicate edges.
 */
/**
 * @brief Builds a WeightedGraph from js-graph-algorithms.
 *
 * @example
 * // Example: create graph with negative weights and compute Dijkstra
 * const g = buildJGraph(true);
 * const d = new JGraph.Dijkstra(g, 0);
 * console.log(d.distTo(5));
 *
 * @param useNegative If true, randomly assigns negative weights.
 * @return {JGraph.WeightedGraph} Constructed graph.
 */

const Benchmark = require('benchmark');
const Graphology = require('graphology');
const { bfs, dfs } = require('graphology-traversal');
const dijkstraGraphology = require('graphology-shortest-path/dijkstra').bidirectional;
const JGraph = require('js-graph-algorithms');
const { Graph, WeightedGraph, NegativeWeightedGraph, DirectedGraph } = require('./my_structures');

/**
 * @brief Number of vertices used in all benchmarks.
 */
const VERTICES_COUNT = 200;

/**
 * @brief Number of edges for generating random graphs.
 */
const EDGES_COUNT = 1500;

/**
 * @brief Start vertex for all search algorithms.
 */
const startNode = 0;

/**
 * @brief Target vertex for shortest path algorithms.
 */
const targetNode = VERTICES_COUNT - 1;

/**
 * @brief Array of vertex IDs (0..VERTICES_COUNT-1).
 */
const vertices = Array.from({ length: VERTICES_COUNT }, (_, i) => i);

/**
 * @brief Random list of edges with weights.
 * @details Each edge: [u, v, weight].
 */
const edges = Array.from({ length: EDGES_COUNT }, () => [
    Math.floor(Math.random() * VERTICES_COUNT),
    Math.floor(Math.random() * VERTICES_COUNT),
    Math.random() * 10
]);

// ======================================================
// ========== GRAPH CONSTRUCTION FUNCTIONS ==============
// ======================================================

/**
 * @brief Builds an undirected Graphology graph with random edges.
 *
 * @return {Graphology.Graph} Constructed graph.
 *
 * @note Skips self-loops and duplicate edges.
 */
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

/**
 * @brief Builds a WeightedGraph from js-graph-algorithms.
 *
 * @param useNegative If true, randomly assigns some negative weights.
 * @return {JGraph.WeightedGraph} Constructed graph.
 */
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


/**
 * @brief Benchmark suite for BFS/DFS algorithms.
 */
const libGraphology = buildGraphology();
const suiteTraversal = new Benchmark.Suite('Traversal Benchmarks (BFS, DFS)');

suiteTraversal
/**
 * @brief Benchmark: Custom Graph BFS.
 */
.add('My Graph BFS', function() {
    const myGraph = new Graph(vertices);
    for (const [u, v] of edges) myGraph.addEdge(u, v);
    myGraph.bfs(startNode);
})

/**
 * @brief Benchmark: Graphology BFS.
 */
.add('Graphology BFS', function() {
    let count = 0;
    bfs(libGraphology, startNode, () => { count++; });
})

/**
 * @brief Benchmark: Custom DirectedGraph DFS.
 */
.add('My DirectedGraph DFS', function() {
    const myDGraph = new DirectedGraph(vertices);
    for (const [u, v] of edges) myDGraph.addEdge(u, v);
    myDGraph.dfs(startNode);
})

/**
 * @brief Benchmark: Graphology DFS.
 */
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
});

// ===============================================
// BENCHMARK FOR DIJKSTRA
// ===============================================

/**
 * @brief Benchmark suite for Dijkstra algorithms.
 */
const suiteDijkstra = new Benchmark.Suite('Dijkstra Benchmarks');

suiteDijkstra
/**
 * @brief Benchmark: Custom WeightedGraph Dijkstra.
 */
.add('My WeightedGraph Dijkstra', function() {
    const myWGraph = new WeightedGraph(vertices);
    for (const [u, v, w] of edges) myWGraph.addUndirectedEdge(u, v, w);
    myWGraph.dijkstra(startNode);
})

/**
 * @brief Benchmark: Graphology Dijkstra.
 */
.add('Graphology Dijkstra', function() {
    dijkstraGraphology(libGraphology, startNode, targetNode);
})

/**
 * @brief Benchmark: js-graph-algorithms Dijkstra.
 */
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
});

// ===============================================
// BENCHMARK FOR BELLMAN FORD
// ===============================================

/**
 * @brief Random edges including negative weights.
 */
const NEGATIVE_EDGES = Array.from({ length: EDGES_COUNT }, () => [
    Math.floor(Math.random() * VERTICES_COUNT),
    Math.floor(Math.random() * VERTICES_COUNT),
    (Math.random() - 0.5) * 20
]);

/**
 * @brief Benchmark suite for Bellman-Ford.
 */
const suiteBellmanFord = new Benchmark.Suite('Bellman-Ford Benchmarks');

suiteBellmanFord
/**
 * @brief Benchmark: Custom NegativeWeightedGraph Bellman-Ford implementation.
 *
 * @note Negative cycles are caught in try/catch.
 */
.add('My NegativeWeightedGraph BellmanFord', function() {
    const myNWGraph = new NegativeWeightedGraph(vertices);
    for (const [u, v, w] of NEGATIVE_EDGES) myNWGraph.addEdge(u, v, w);
    try {
        myNWGraph.BellmanFord(startNode);
    } catch (e) {}
})

/**
 * @brief Benchmark: js-graph-algorithms Bellman-Ford.
 */
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
});

console.log('--- STARTING GRAPH BENCHMARKS ---');
suiteTraversal.run({ 'async': false });
suiteDijkstra.run({ 'async': false });
suiteBellmanFord.run({ 'async': false });
console.log('--- END OF GRAPH BENCHMARKS ---');