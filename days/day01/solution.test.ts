import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { part1, part2 } from "./solution.js";

const example = readFileSync(
  fileURLToPath(new URL("./example.txt", import.meta.url)),
  "utf8",
);

/**
 * The example test is the red-green gate. The dial lands on 0 three times at
 * the end of a rotation (Part 1 = 3), plus three more times mid-rotation, so
 * Part 2 = 6.
 */
describe("day 01: Secret Entrance", () => {
  it("part1 matches the sample", () => {
    expect(part1(example)).toBe(3);
  });

  it("part2 matches the sample", () => {
    expect(part2(example)).toBe(6);
  });
});
