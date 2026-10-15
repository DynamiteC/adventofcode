#!/usr/bin/env tsx
/**
 * Day generator. Usage: pnpm new <day>  or  make new D=01
 * Creates days/dayXX/{solution.ts, solution.test.ts, example.txt, input.txt}
 * from templates/. Idempotent: never overwrites an existing file.
 */
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function normalizeDay(raw: string | undefined): string {
  if (!raw) {
    console.error("Usage: pnpm new <day>   (e.g. pnpm new 1 or pnpm new 01)");
    process.exit(1);
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 25) {
    console.error(`Invalid day "${raw}". Expected an integer 1-25.`);
    process.exit(1);
  }
  return String(n).padStart(2, "0");
}

function writeIfAbsent(path: string, content: string): void {
  if (existsSync(path)) {
    console.log(`  skip   ${rel(path)} (exists)`);
    return;
  }
  writeFileSync(path, content);
  console.log(`  create ${rel(path)}`);
}

function rel(path: string): string {
  return path.startsWith(root) ? path.slice(root.length + 1) : path;
}

function renderTemplate(name: string, day: string): string {
  const tmpl = readFileSync(join(root, "templates", name), "utf8");
  return tmpl.replaceAll("__DAY__", day);
}

const day = normalizeDay(process.argv[2]);
const dayDir = join(root, "days", `day${day}`);
mkdirSync(dayDir, { recursive: true });

console.log(`Scaffolding day${day}:`);
writeIfAbsent(join(dayDir, "solution.ts"), renderTemplate("solution.ts.tmpl", day));
writeIfAbsent(join(dayDir, "solution.test.ts"), renderTemplate("solution.test.ts.tmpl", day));
writeIfAbsent(join(dayDir, "example.txt"), "");
writeIfAbsent(join(dayDir, "input.txt"), "");

console.log(`\nNext:`);
console.log(`  1. Paste the sample into days/day${day}/example.txt`);
console.log(`  2. Paste your puzzle input into days/day${day}/input.txt`);
console.log(`  3. Set expected sample outputs in solution.test.ts`);
console.log(`  4. make test D=${day}   then   make solve D=${day}`);
