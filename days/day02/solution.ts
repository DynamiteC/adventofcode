/**
 * Day 02 (2025): Gift Shop.
 * Input is comma-separated ranges "first-last". An ID is invalid when it is a
 * digit sequence repeated exactly twice (55, 6464, 123123), with no leading
 * zeros. Part 1 sums every invalid ID that falls inside any range.
 *
 * Ranges span up to ~2e9, so we never scan them. Instead we enumerate the
 * candidates directly: an invalid ID is concat(h, h) where h has no leading
 * zero. For each half of L digits, h runs 10^(L-1)..10^L-1 (and the single
 * digits 1..9 for L=1), giving at most a few hundred thousand candidates.
 */

type Range = { lo: number; hi: number };

function parse(input: string): Range[] {
  return input
    .trim()
    .split(",")
    .map((pair) => {
      const [lo, hi] = pair.trim().split("-").map(Number);
      return { lo: lo!, hi: hi! };
    });
}

/** All invalid IDs with a half of exactly `half` digits, as a sorted list. */
function doubledForHalfLength(half: number): number[] {
  const start = half === 1 ? 1 : 10 ** (half - 1);
  const end = 10 ** half; // exclusive
  const out: number[] = [];
  for (let h = start; h < end; h++) {
    // concat(h, h) = h * 10^half + h
    out.push(h * 10 ** half + h);
  }
  return out;
}

export function part1(input: string): number {
  const ranges = parse(input);
  const maxHi = ranges.reduce((m, r) => Math.max(m, r.hi), 0);
  const maxDigits = String(maxHi).length;

  let total = 0;
  // Invalid IDs have even length, so half length goes 1..floor(maxDigits/2).
  for (let half = 1; half * 2 <= maxDigits; half++) {
    for (const id of doubledForHalfLength(half)) {
      if (id > maxHi) break; // sorted, nothing larger fits
      for (const r of ranges) {
        if (id >= r.lo && id <= r.hi) {
          total += id;
          break; // ranges in AoC do not overlap; count each ID once
        }
      }
    }
  }
  return total;
}

export function part2(input: string): number {
  void input;
  throw new Error("Part 2 not yet implemented");
}
