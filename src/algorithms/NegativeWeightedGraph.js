export class NegativeWeightedGraph<T> extends Graph<T> {
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
BellmanFord(start: T): Map<T, number> {
    const dist = new Map<T, number>();

    for (const v of this.vertices) dist.set(v, Infinity);
    dist.set(start, 0);

    const n = this.vertices.length;

    for (let i = 0; i < n - 1; i++) {
      let changed = false;
      for (const [u, v, w] of this.weightedEdges) {
        const du = dist.get(u)!;
        const dv = dist.get(v)!;
        if (du !== Infinity && du + w < dv) {
          dist.set(v, du + w);
          changed = true;
        }
      }
      if (!changed) break;
    }

    for (const [u, v, w] of this.weightedEdges) {
      const du = dist.get(u)!;
      const dv = dist.get(v)!;
      if (du !== Infinity && du + w < dv) {
        throw new Error("Graph contains a negative-weight cycle");
      }
    }

    return dist;
  }
}