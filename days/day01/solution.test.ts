import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { part1, part2 } from "./solution.js";

const example = readFileSync(
  fileURLToPath(new URL("./example.txt", import.meta.url)),
  "utf8",
);

/**
 * The example test is the red-green gate. Fill in the expected sample
 * outputs from puzzle.md, then make them pass before running real input.
 */
describe("day 01", () => {
  it("part1 matches the sample", () => {
    expect(part1(example)).toBe(-3);
  });

  it("part2 matches the sample", () => {
    expect(part2(example)).toBe(1);
  });
});
