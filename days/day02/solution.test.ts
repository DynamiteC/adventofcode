import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { part1, part2 } from "./solution.js";

const example = readFileSync(
  fileURLToPath(new URL("./example.txt", import.meta.url)),
  "utf8",
);

/**
 * The example test is the red-green gate. Invalid IDs (a digit sequence
 * repeated twice) in the sample ranges sum to 1227775554.
 */
describe("day 02: Gift Shop", () => {
  it("part1 matches the sample", () => {
    expect(part1(example)).toBe(1227775554);
  });

  it.skip("part2 matches the sample", () => {
    expect(part2(example)).toBe(0); // TODO: fill once Part 2 unlocks
  });
});
