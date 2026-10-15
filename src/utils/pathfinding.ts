/** Graph search helpers: BFS, Dijkstra, and a binary min-heap. */

/** Binary min-heap keyed by a numeric priority. */
export class MinHeap<T> {
  private readonly items: { priority: number; value: T }[] = [];

  get size(): number {
    return this.items.length;
  }

  push(priority: number, value: T): void {
    const items = this.items;
    items.push({ priority, value });
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent]!.priority <= items[i]!.priority) break;
      [items[parent], items[i]] = [items[i]!, items[parent]!];
      i = parent;
    }
  }

  pop(): T | undefined {
    const items = this.items;
    if (items.length === 0) return undefined;
    const top = items[0]!;
    const last = items.pop()!;
    if (items.length > 0) {
      items[0] = last;
      this.sinkDown(0);
    }
    return top.value;
  }

  private sinkDown(i: number): void {
    const items = this.items;
    const n = items.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && items[left]!.priority < items[smallest]!.priority) smallest = left;
      if (right < n && items[right]!.priority < items[smallest]!.priority) smallest = right;
      if (smallest === i) break;
      [items[smallest], items[i]] = [items[i]!, items[smallest]!];
      i = smallest;
    }
  }
}

/**
 * Breadth-first search over any state graph. Returns a map of state key to
 * shortest step count from the start. States are compared by their string key.
 */
export function bfs<S>(
  start: S,
  keyOf: (state: S) => string,
  neighborsOf: (state: S) => Iterable<S>,
): Map<string, number> {
  const dist = new Map<string, number>();
  const queue: S[] = [start];
  dist.set(keyOf(start), 0);
  let head = 0;
  while (head < queue.length) {
    const cur = queue[head++]!;
    const d = dist.get(keyOf(cur))!;
    for (const next of neighborsOf(cur)) {
      const k = keyOf(next);
      if (!dist.has(k)) {
        dist.set(k, d + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

/**
 * Dijkstra shortest paths over a weighted state graph. `neighborsOf` yields
 * [nextState, edgeCost] pairs. Returns a map of state key to minimum cost.
 */
export function dijkstra<S>(
  start: S,
  keyOf: (state: S) => string,
  neighborsOf: (state: S) => Iterable<readonly [S, number]>,
): Map<string, number> {
  const dist = new Map<string, number>();
  const heap = new MinHeap<S>();
  dist.set(keyOf(start), 0);
  heap.push(0, start);
  while (heap.size > 0) {
    const cur = heap.pop()!;
    const ck = keyOf(cur);
    const cd = dist.get(ck)!;
    for (const [next, cost] of neighborsOf(cur)) {
      const nk = keyOf(next);
      const nd = cd + cost;
      if (nd < (dist.get(nk) ?? Infinity)) {
        dist.set(nk, nd);
        heap.push(nd, next);
      }
    }
  }
  return dist;
}
