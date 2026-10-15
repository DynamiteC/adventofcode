# Advent of Code Workflow

This repo solves Advent of Code puzzles as an engineering pair. Follow this loop for every puzzle.

## Per-puzzle loop

1. Read `days/dayXX/puzzle.md` and `days/dayXX/example.txt` first. Restate the problem in one or two sentences and name the expected sample outputs for Part 1 and Part 2.
2. For non-trivial Part 2 work, discuss time and space complexity and the chosen data structures briefly before writing the optimization. Flag the complexity target and any risk of exceeding it.
3. Always run against `example.txt` and assert the expected sample output BEFORE running against `input.txt`. The example test is the red-green gate: it must pass before touching real input.
4. Benchmark execution time for Part 1 and Part 2 on every run. Target under 100ms per part. If a part exceeds the target, call it out and discuss an optimization before moving on.

## TDD discipline

- Write or wire the failing example test first, then the minimal implementation, then refactor.
- `part1(input)` and `part2(input)` are pure functions of the raw input string. No file reads inside them.
- Parsing lives at the top of the solution or in `src/utils`, not scattered through the logic.

## Content and licensing

- Never commit puzzle inputs or puzzle text. AoC asks that inputs and prose not be redistributed.
- `input.txt`, `example.txt`, and `puzzle.md` are gitignored. Only `solution.ts` and `solution.test.ts` are tracked per day.

## Commands

- `make new D=01` generates `days/day01/`.
- `make test D=01` runs the vitest unit test against `example.txt`.
- `make solve D=01` runs the solution against `input.txt` with microsecond timing.
