import { lines } from "@utils";

/**
 * Day 01 (2025): Secret Entrance.
 * A dial numbered 0-99 starts at 50. Each line is a rotation: 'L' turns toward
 * lower numbers, 'R' toward higher, wrapping modulo 100. Part 1 counts how
 * many times the dial lands on 0 after a rotation.
 */

const DIAL_SIZE = 100;
const START = 50;

type Rotation = { dir: 1 | -1; distance: number };

function parse(input: string): Rotation[] {
  return lines(input).map((line) => {
    const dir = line[0] === "R" ? 1 : -1;
    const distance = Number(line.slice(1));
    return { dir, distance };
  });
}

export function part1(input: string): number {
  const rotations = parse(input);
  let position = START;
  let zeros = 0;
  for (const { dir, distance } of rotations) {
    position = (((position + dir * distance) % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE;
    if (position === 0) zeros++;
  }
  return zeros;
}

/**
 * Count how many clicks in a single rotation land on 0, including pass-throughs
 * mid-rotation (Part 2 "method 0x434C49434B"). O(1) via modular arithmetic, so
 * large distances like R1000 do not need stepping click by click.
 *
 * Moving `distance` clicks from `position` in `dir`, click k (1..distance) sits
 * at (position + dir*k) mod 100. That equals 0 when k is congruent to a fixed
 * residue mod 100. firstK is the smallest such k >= 1; every 100th click after
 * it also lands on 0.
 */
function zeroHits(position: number, dir: 1 | -1, distance: number): number {
  const residue = dir === 1 ? (DIAL_SIZE - position) % DIAL_SIZE : position % DIAL_SIZE;
  const firstK = residue === 0 ? DIAL_SIZE : residue;
  if (firstK > distance) return 0;
  return Math.floor((distance - firstK) / DIAL_SIZE) + 1;
}

export function part2(input: string): number {
  const rotations = parse(input);
  let position = START;
  let zeros = 0;
  for (const { dir, distance } of rotations) {
    zeros += zeroHits(position, dir, distance);
    position = (((position + dir * distance) % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE;
  }
  return zeros;
}
