import { lines } from "@utils";

/**
 * Day 01 (AoC 2015 Day 1, used here to verify the scaffold loop):
 * '(' goes up one floor, ')' goes down one. Part 1 is the final floor.
 * Part 2 is the 1-indexed position of the first move into the basement (-1).
 */

export function part1(input: string): number {
  const [chars = ""] = lines(input);
  let floor = 0;
  for (const ch of chars) floor += ch === "(" ? 1 : ch === ")" ? -1 : 0;
  return floor;
}

export function part2(input: string): number {
  const [chars = ""] = lines(input);
  let floor = 0;
  for (let i = 0; i < chars.length; i++) {
    floor += chars[i] === "(" ? 1 : chars[i] === ")" ? -1 : 0;
    if (floor === -1) return i + 1;
  }
  return -1;
}
