export class SimpleBST /*<T>*/ {
    constructor() {
        this.root = null;
    }

    createNode(v) {
        return { v, left: null, right: null, height: 1 }; 
    }

    insert(v) {
        const node = this.createNode(v);

        if (!this.root) {
            this.root = node;
            return;
        }

        let cur = this.root;
        while (true) {
            if (v < cur.v) {
                if (!cur.left) {
                    cur.left = node;
                    return;
                }
                cur = cur.left;
            } else {
                if (!cur.right) {
                    cur.right = node;
                    return;
                }
                cur = cur.right;
            }
        }
    }

    _inorder(node, out) {
        if (!node) return;
        this._inorder(node.left, out);
        out.push(node.v);
        this._inorder(node.right, out);
    }

    inorder() {
        const out = [];
        this._inorder(this.root, out);
        return out;
    }

    minValue(node) {
        if (!node) return null;
        let current = node;
        while (current.left) current = current.left;
        return current.v;
    }

    _deleteNode(node, value) {
        if (!node) return null;

        if (value < node.v) {
            node.left = this._deleteNode(node.left, value);
        } else if (value > node.v) {
            node.right = this._deleteNode(node.right, value);
        } else {
            if (!node.left && !node.right) return null;
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            const minVal = this.minValue(node.right);
            node.v = minVal;
            node.right = this._deleteNode(node.right, minVal);
        }
        return node;
    }

    deleteNode(value) {
        this.root = this._deleteNode(this.root, value);
    }

    clear() {
        this.root = null;
    }
}

export class BalancedBST extends SimpleBST {
    getHeight(node = this.root) {
        if (!node) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
}

export class AVLTree extends SimpleBST {
    constructor() {
        super();
        this.createNode = (v) => ({ v, left: null, right: null, height: 1 });
    }
    insert(v) {
        this.root = this._insert(this.root, v);
    }
    
    height(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        if (!node) return 0;
        return this.height(node.left) - this.height(node.right);
    }

    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

        return x;
    }

    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    _insert(node, v) {
        if (!node) return this.createNode(v);

        if (v < node.v) node.left = this._insert(node.left, v);
        else if (v > node.v) node.right = this._insert(node.right, v);
        else return node; 

        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        const balance = this.getBalance(node);

    
        if (balance > 1 && v < node.left.v) return this.rotateRight(node);

    
        if (balance < -1 && v > node.right.v) return this.rotateLeft(node);

        
        if (balance > 1 && v > node.left.v) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        if (balance < -1 && v < node.right.v) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }
}



export class Graph /*<T>*/ {
    constructor(vertices = []) {
        this.vertices = [...vertices];
        this.edges = []; 
    }

    addVertex(v) {
        if (!this.vertices.includes(v)) this.vertices.push(v);
    }

    addEdge(u, v) {
        if (!this.vertices.includes(u)) this.vertices.push(u);
        if (!this.vertices.includes(v)) this.vertices.push(v);
        this.edges.push([u, v]);
        this.edges.push([v, u]); 
    }

    clear() {
        this.vertices = [];
        this.edges = [];
    }

    bfs(start) {
        const visited = new Set();
        const queue = [];
        const order = [];

        if (!this.vertices.includes(start)) return order;

        visited.add(start);
        queue.push(start);

        while (queue.length > 0) {
            const current = queue.shift();
            order.push(current);

            const neighbors = this.edges
                .filter(([u]) => u === current)
                .map(([_, v]) => v);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return order;
    }
    
}

export class WeightedGraph extends Graph {
    constructor(vertices = []) {
        super(vertices);
        this.weightedEdges = [];
    }

    addEdge(u, v, w) {
        if (!this.vertices.includes(u)) this.vertices.push(u);
        if (!this.vertices.includes(v)) this.vertices.push(v);
        this.weightedEdges.push([u, v, w]);
    }

    addUndirectedEdge(u, v, w) {
        this.addEdge(u, v, w);
        this.addEdge(v, u, w);
    }

    getWeight(u, v) {
        const e = this.weightedEdges.find(([a, b]) => a === u && b === v);
        return e ? e[2] : undefined;
    }

    dijkstra(start) {
        const dist = new Map();
        const visited = new Set();

        for (const v of this.vertices) dist.set(v, Infinity);
        dist.set(start, 0);

        while (visited.size < this.vertices.length) {
            let u = null;
            let minDist = Infinity;
            
            for (const [v, d] of dist) {
                if (!visited.has(v) && d < minDist) {
                    minDist = d;
                    u = v;
                }
            }

            if (u === null) break;
            visited.add(u);

            const neighbors = this.weightedEdges.filter(([a]) => a === u);
            for (const [_, v, w] of neighbors) {
                const alt = (dist.get(u) ?? Infinity) + w;
                if (alt < (dist.get(v) ?? Infinity)) {
                    dist.set(v, alt);
                }
            }
        }
        return dist;
    }
}

export class NegativeWeightedGraph extends Graph {
    constructor(vertices = []) {
        super(vertices);
        this.weightedEdges = [];
    }

    addEdge(u, v, w) {
        if (!this.vertices.includes(u)) this.vertices.push(u);
        if (!this.vertices.includes(v)) this.vertices.push(v);
        this.weightedEdges.push([u, v, w]);
    }

    BellmanFord(start) {
        const dist = new Map();

        for (const v of this.vertices) dist.set(v, Infinity);
        dist.set(start, 0);

        const n = this.vertices.length;

        for (let i = 0; i < n - 1; i++) {
            let changed = false;
            for (const [u, v, w] of this.weightedEdges) {
                const du = dist.get(u);
                const dv = dist.get(v);
                if (du !== Infinity && du + w < dv) {
                    dist.set(v, du + w);
                    changed = true;
                }
            }
            if (!changed) break;
        }

        for (const [u, v, w] of this.weightedEdges) {
            const du = dist.get(u);
            const dv = dist.get(v);
            if (du !== Infinity && du + w < dv) {
                throw new Error("Graph contains a negative-weight cycle");
            }
        }

        return dist;
    }
}

export class DirectedGraph extends Graph {
    addEdge(u, v) {
        if (!this.vertices.includes(u)) this.vertices.push(u);
        if (!this.vertices.includes(v)) this.vertices.push(v);
        this.edges.push([u, v]); 
    }

    dfs(start) {
        const visited = new Set();
        const order = [];

        const dfsVisit = (v) => {
            visited.add(v);
            order.push(v);

            const neighbors = this.edges
                .filter(([u]) => u === v)
                .map(([_, w]) => w);

            for (const n of neighbors) {
                if (!visited.has(n)) dfsVisit(n);
            }
        };

        if (this.vertices.includes(start)) dfsVisit(start);
        return order;
    }

}

export class LinkedList {
    constructor(arr = []) { this.arr = [...arr]; }
    insert_at(idx, value) {
        if (idx < 0) idx = 0;
        if (idx > this.arr.length) idx = this.arr.length;
        this.arr.splice(idx, 0, value); 
    }
    remove_at(idx) { 
        if (idx < 0 || idx >= this.arr.length) return; 
        this.arr.splice(idx, 1); 
    }
    clear() { this.arr = []; }
    toArray() { return [...this.arr]; }
}

export class SimpleQueue {
    constructor(arr = []) { this.arr = [...arr]; }
    enqueue(v) { this.arr.push(v); } 
    dequeue() { if (this.arr.length) this.arr.shift(); } 
    toArray() { return [...this.arr]; }
    clear() { this.arr = []; }
}

export class SimpleStack {
    constructor(arr = []) { this.arr = [...arr]; }
    push(v) { this.arr.push(v); } 
    pop() { this.arr.pop(); }
    toArray() { return [...this.arr]; }
    clear() { this.arr = []; }
}