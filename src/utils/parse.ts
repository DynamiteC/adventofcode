/** Input line and token parsing helpers. All pure, operate on the raw string. */

/** Split into trimmed non-empty lines (trailing newline tolerant). */
export function lines(input: string): string[] {
  return input.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
}

/** Split into blank-line-separated blocks, each as an array of lines. */
export function blocks(input: string): string[][] {
  return input
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.split("\n"));
}

/** Extract every signed integer in the string, in order. */
export function ints(input: string): number[] {
  return (input.match(/-?\d+/g) ?? []).map(Number);
}

/** Extract every unsigned integer in the string, in order. */
export function uints(input: string): number[] {
  return (input.match(/\d+/g) ?? []).map(Number);
}

/** Parse a grid of single characters into a 2D array. */
export function charGrid(input: string): string[][] {
  return lines(input).map((line) => [...line]);
}

/** Parse a grid of single-digit numbers into a 2D number array. */
export function digitGrid(input: string): number[][] {
  return lines(input).map((line) => [...line].map(Number));
}

/** Split a single line by a separator, trimming each field. */
export function fields(line: string, sep: string | RegExp = /\s+/): string[] {
  return line.trim().split(sep).filter(Boolean);
}
