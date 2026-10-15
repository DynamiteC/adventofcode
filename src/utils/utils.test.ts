import { describe, it, expect } from "vitest";
import {
  lines,
  blocks,
  ints,
  digitGrid,
  sum,
  product,
  gcd,
  lcm,
  lcmAll,
  MinHeap,
  bfs,
  dijkstra,
  manhattan,
} from "./index.js";

describe("parse", () => {
  it("splits lines and tolerates trailing newlines", () => {
    expect(lines("a\nb\nc\n")).toEqual(["a", "b", "c"]);
  });

  it("splits blank-line blocks", () => {
    expect(blocks("1\n2\n\n3\n4")).toEqual([
      ["1", "2"],
      ["3", "4"],
    ]);
  });

  it("extracts signed integers", () => {
    expect(ints("x=-3, y=10 z 2")).toEqual([-3, 10, 2]);
  });

  it("parses a digit grid", () => {
    expect(digitGrid("123\n456")).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });
});

describe("range math", () => {
  it("sums and multiplies", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(product([2, 3, 4])).toBe(24);
  });

  it("computes gcd/lcm", () => {
    expect(gcd(12, 18)).toBe(6);
    expect(lcm(4, 6)).toBe(12);
    expect(lcmAll([2, 3, 4])).toBe(12);
  });
});

describe("pathfinding", () => {
  it("min-heap pops in priority order", () => {
    const h = new MinHeap<string>();
    h.push(5, "e");
    h.push(1, "a");
    h.push(3, "c");
    expect([h.pop(), h.pop(), h.pop()]).toEqual(["a", "c", "e"]);
  });

  it("bfs finds shortest step counts on a line graph", () => {
    const dist = bfs(
      0,
      (n) => String(n),
      (n) => (n < 3 ? [n + 1] : []),
    );
    expect(dist.get("3")).toBe(3);
  });

  it("dijkstra respects edge weights", () => {
    // 0 ->(1) 1 ->(1) 2  vs  0 ->(5) 2
    const edges: Record<number, [number, number][]> = {
      0: [
        [1, 1],
        [2, 5],
      ],
      1: [[2, 1]],
      2: [],
    };
    const dist = dijkstra(
      0,
      (n) => String(n),
      (n) => edges[n] ?? [],
    );
    expect(dist.get("2")).toBe(2);
  });
});

describe("grid", () => {
  it("computes manhattan distance", () => {
    expect(manhattan([0, 0], [3, 4])).toBe(7);
  });
});
