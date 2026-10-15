/** Range math and common numeric reducers. */

/** Inclusive-exclusive integer range [start, end). */
export function range(start: number, end: number, step = 1): number[] {
  const out: number[] = [];
  if (step === 0) throw new Error("range step cannot be 0");
  if (step > 0) for (let i = start; i < end; i += step) out.push(i);
  else for (let i = start; i > end; i += step) out.push(i);
  return out;
}

export function sum(xs: readonly number[]): number {
  let total = 0;
  for (const x of xs) total += x;
  return total;
}

export function product(xs: readonly number[]): number {
  let total = 1;
  for (const x of xs) total *= x;
  return total;
}

export function min(xs: readonly number[]): number {
  return xs.reduce((a, b) => (b < a ? b : a), Infinity);
}

export function max(xs: readonly number[]): number {
  return xs.reduce((a, b) => (b > a ? b : a), -Infinity);
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : Math.abs((a / gcd(a, b)) * b);
}

/** Least common multiple of a list, useful for cycle problems. */
export function lcmAll(xs: readonly number[]): number {
  return xs.reduce((acc, x) => lcm(acc, x), 1);
}
