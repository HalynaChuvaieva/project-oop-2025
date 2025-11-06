export class WeightedGraph<T> extends Graph<T> {
  weightedEdges: [T, T, number][];

  constructor(vertices: T[] = []) {
    super(vertices);
    this.weightedEdges = [];
  }

  addEdge(u: T, v: T, w: number): void {
    if (!this.vertices.includes(u)) this.vertices.push(u);
    if (!this.vertices.includes(v)) this.vertices.push(v);
    this.weightedEdges.push([u, v, w]);
  }

  addUndirectedEdge(u: T, v: T, w: number): void {
    this.addEdge(u, v, w);
    this.addEdge(v, u, w);
  }

  getWeight(u: T, v: T): number | undefined {
    const e = this.weightedEdges.find(([a, b]) => a === u && b === v);
    return e ? e[2] : undefined;
  }

  dijkstra(start: T): Map<T, number> {
    const dist = new Map<T, number>();
    const visited = new Set<T>();

    for (const v of this.vertices) dist.set(v, Infinity);
    dist.set(start, 0);

    while (visited.size < this.vertices.length) {
      let u: T | null = null;
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