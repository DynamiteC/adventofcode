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
- `input.txt` and `puzzle.md` are gitignored. `example.txt` IS tracked (sample test cases) along with `solution.ts` and `solution.test.ts`, so `make test` works anywhere.

## Commands

- `make new D=01` generates `days/day01/`.
- `make test D=01` runs the vitest unit test against `example.txt`.
- `make solve D=01` runs the solution against `input.txt` with microsecond timing.

## Shorthand Commands

These are standing macros. When the user types one, run the full sequence autonomously without asking for confirmation at each step. `XX` is the zero-padded day.

### `start D=XX`

Solve Part 1 end to end:

1. `make new D=XX` then `make fetch D=XX` (scaffold, then download input.txt and puzzle.md).
2. Read `days/dayXX/puzzle.md`. Restate the problem in one or two sentences and identify the Part 1 sample input and expected answer.
3. Write the real sample into `days/dayXX/example.txt` and set the Part 1 expected value in `days/dayXX/solution.test.ts` (keep the Part 2 test skipped).
4. Implement `part1()` in `days/dayXX/solution.ts`. Prefer helpers from `src/utils`.
5. Verify: `make test D=XX` (example gate must pass) and `make typecheck` (must be clean).
6. Run `make solve D=XX` and report the Part 1 answer and timing. Do not commit or push.

### `part2 D=XX`

Solve Part 2 end to end and ship it:

1. `FORCE=1 make fetch D=XX` to pull the newly unlocked Part 2 prose into puzzle.md.
2. Read the Part 2 article in `days/dayXX/puzzle.md`. Identify the Part 2 sample expectation.
3. If Part 2 is non-trivial, briefly state the chosen approach, time/space complexity, and edge cases before implementing (per the per-puzzle loop).
4. Add/enable the Part 2 sample assertion in `solution.test.ts` and implement an optimal `part2()` in `solution.ts`.
5. Verify: `make test D=XX` and `make typecheck` must pass.
6. Run `make solve D=XX` and report the Part 2 answer and timing.
7. Commit the tracked files with message `feat(dayXX): solve 2025 day XX part 1 and 2` and push to origin. The push is pre-authorized by this macro definition.

### Guardrails for both macros

- Never fabricate answers. If `make fetch` fails (expired session, puzzle locked), stop and report rather than inventing a solution.
- Never stage `.env`, `input.txt`, or `puzzle.md`. Verify the staged set before any commit.
- If a verification step fails, stop and fix before proceeding; do not commit red code.
