/** Grid coordinate and traversal helpers. */

export type Point = readonly [row: number, col: number];

/** 4-directional neighbor offsets (N, S, W, E). */
export const DIRS4: readonly Point[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/** 8-directional neighbor offsets (orthogonal + diagonal). */
export const DIRS8: readonly Point[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

/** True if (r, c) is inside a grid of the given dimensions. */
export function inBounds(r: number, c: number, rows: number, cols: number): boolean {
  return r >= 0 && c >= 0 && r < rows && c < cols;
}

/** In-bounds neighbors of (r, c) for the given direction set. */
export function neighbors<T>(
  grid: readonly (readonly T[])[],
  r: number,
  c: number,
  dirs: readonly Point[] = DIRS4,
): Point[] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const out: Point[] = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (inBounds(nr, nc, rows, cols)) out.push([nr, nc]);
  }
  return out;
}

/** Stable string key for a point, for use in Set/Map. */
export function key(r: number, c: number): string {
  return `${r},${c}`;
}

/** Iterate every cell with its coordinates. */
export function* cells<T>(
  grid: readonly (readonly T[])[],
): Generator<readonly [row: number, col: number, value: T]> {
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r]!;
    for (let c = 0; c < row.length; c++) {
      yield [r, c, row[c]!] as const;
    }
  }
}

/** Manhattan distance between two points. */
export function manhattan(a: Point, b: Point): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
