export default class Graph<T> {
  vertices: T[];
  edges: [T, T][];

  constructor(vertices: T[] = []) {
    this.vertices = [...vertices];
    this.edges = [];
  }

  addVertex(v: T): void {
    if (!this.vertices.includes(v)) this.vertices.push(v);
  }

  addEdge(u: T, v: T): void {
    if (!this.vertices.includes(u)) this.vertices.push(u);
    if (!this.vertices.includes(v)) this.vertices.push(v);
    this.edges.push([u, v]);
    this.edges.push([v, u]); 
  }

  clear(): void {
    this.vertices = [];
    this.edges = [];
  }

  toJSON(): object {
    return { vertices: this.vertices, edges: this.edges };
  }

  fromJSON(obj: { vertices?: T[]; edges?: [T, T][] }): void {
    if (obj.vertices) this.vertices = [...obj.vertices];
    if (obj.edges) this.edges = [...obj.edges];
  }

  bfs(start: T): T[] {
    const visited = new Set<T>();
    const queue: T[] = [];
    const order: T[] = [];

    if (!this.vertices.includes(start)) return order;

    visited.add(start);
    queue.push(start);

    while (queue.length > 0) {
      const current = queue.shift()!;
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

  buildSpanningTree(start: T): { vertices: T[]; edges: [T, T][] } {
    const visited = new Set<T>();
    const treeEdges: [T, T][] = [];
    const queue: T[] = [];

    if (!this.vertices.includes(start))
      return { vertices: [], edges: [] };

    visited.add(start);
    queue.push(start);

    while (queue.length > 0) {
      const current = queue.shift()!;

      const neighbors = this.edges
        .filter(([u]) => u === current)
        .map(([_, v]) => v);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          treeEdges.push([current, neighbor]);
          queue.push(neighbor);
        }
      }
    }

    const treeVertices = Array.from(visited);
    return { vertices: treeVertices, edges: treeEdges };
  }
}
