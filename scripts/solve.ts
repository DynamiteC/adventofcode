#!/usr/bin/env tsx
/**
 * Solve runner. Usage: pnpm solve <day>  or  make solve D=01
 * Runs part1 and part2 against days/dayXX/input.txt with microsecond timing.
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function normalizeDay(raw: string | undefined): string {
  if (!raw) {
    console.error("Usage: pnpm solve <day>   (e.g. pnpm solve 01)");
    process.exit(1);
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 25) {
    console.error(`Invalid day "${raw}". Expected an integer 1-25.`);
    process.exit(1);
  }
  return String(n).padStart(2, "0");
}

function formatMicros(ms: number): string {
  const micros = ms * 1000;
  const label =
    micros < 1000
      ? `${micros.toFixed(1)} us`
      : ms < 1000
        ? `${ms.toFixed(3)} ms`
        : `${(ms / 1000).toFixed(3)} s`;
  const flag = ms > 100 ? "  (over 100ms target)" : "";
  return `${label}${flag}`;
}

type Solver = (input: string) => unknown;

function run(label: string, fn: Solver, input: string): void {
  const start = performance.now();
  const result = fn(input);
  const elapsed = performance.now() - start;
  console.log(`${label}: ${result}`);
  console.log(`  time: ${formatMicros(elapsed)}`);
}

const day = normalizeDay(process.argv[2]);
const dayDir = join(root, "days", `day${day}`);
const inputPath = join(dayDir, "input.txt");
const solutionPath = join(dayDir, "solution.ts");

if (!existsSync(solutionPath)) {
  console.error(`No solution at days/day${day}/solution.ts. Run: make new D=${day}`);
  process.exit(1);
}
if (!existsSync(inputPath) || readFileSync(inputPath, "utf8").trim() === "") {
  console.error(`days/day${day}/input.txt is empty. Paste your puzzle input first.`);
  process.exit(1);
}

const input = readFileSync(inputPath, "utf8");
const mod = (await import(pathToFileURL(solutionPath).href)) as {
  part1: Solver;
  part2: Solver;
};

console.log(`day${day}:`);
run("Part 1", mod.part1, input);
run("Part 2", mod.part2, input);
