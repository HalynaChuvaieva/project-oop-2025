export class DirectedGraph<T> extends Graph<T> {
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
    return this.edges.filter(([_, to]) => to === v).length;
  }

  getOutDegree(v: T): number {
    return this.edges.filter(([from]) => from === v).length;
  }

  isCyclic(): boolean {
    const visited = new Set<T>();
    const recStack = new Set<T>();

    const dfsCycle = (v: T): boolean => {
      if (!visited.has(v)) {
        visited.add(v);
        recStack.add(v);

        const neighbors = this.edges
          .filter(([u]) => u === v)
          .map(([_, w]) => w);

        for (const n of neighbors) {
          if (!visited.has(n) && dfsCycle(n)) return true;
          else if (recStack.has(n)) return true;
        }
      }
      recStack.delete(v);
      return false;
    };

    for (const v of this.vertices) {
      if (dfsCycle(v)) return true;
    }
    return false;
  }
}