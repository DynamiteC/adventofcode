/** Memoization helpers for pure recursive solvers. */

/**
 * Wrap a function so repeated calls with the same arguments are cached.
 * `keyOf` builds the cache key from the arguments; defaults to JSON.
 */
export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  keyOf: (...args: A) => string = (...args) => JSON.stringify(args),
): (...args: A) => R {
  const cache = new Map<string, R>();
  return (...args: A): R => {
    const k = keyOf(...args);
    const hit = cache.get(k);
    if (hit !== undefined || cache.has(k)) return hit as R;
    const value = fn(...args);
    cache.set(k, value);
    return value;
  };
}
