export class UndirectedGraph<T> extends Graph<T> {
  addEdge(u: T, v: T): void {
    super.addEdge(u, v);
    super.addEdge(v, u); 
  }

  dfs(start: T): T[] {
    const visited = new Set<T>();
    const order: T[] = [];

    const dfsVisit = (v: T) => {
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

  getInDegree(v: T): number {
    return this.edges.filter(([u]) => u === v).length;
  }

  getOutDegree(v: T): number {
    return this.getInDegree(v);
  }

  isCyclic(): boolean {
    const visited = new Set<T>();

    const dfsCycle = (v: T, parent: T | null): boolean => {
      visited.add(v);

      const neighbors = this.edges
        .filter(([u]) => u === v)
        .map(([_, w]) => w);

      for (const n of neighbors) {
        if (!visited.has(n)) {
          if (dfsCycle(n, v)) return true;
        } else if (n !== parent) {
          return true; 
        }
      }
      return false;
    };

    for (const v of this.vertices) {
      if (!visited.has(v) && dfsCycle(v, null)) return true;
    }
    return false;
  }
}