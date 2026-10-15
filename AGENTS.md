# AGENTS.md

Advent of Code solutions. TypeScript, pnpm, vitest. See `.kiro/steering/aoc-workflow.md` for the full per-puzzle workflow.

## Stack

- Runtime: Node 22, TypeScript via `tsx` (no build step for solutions).
- Test runner: vitest.
- Package manager: pnpm.
- Task runner: GNU make.

## Layout

```
src/utils/        reusable helpers (parse, grid, pathfinding, memo, range)
scripts/          generator and solve runner
days/dayXX/       solution.ts, solution.test.ts (tracked)
                  example.txt, input.txt, puzzle.md (gitignored)
templates/        files copied by the generator
```

## Workflow (summary)

1. Read `puzzle.md` and `example.txt` before coding.
2. Discuss complexity and data structures before complex Part 2 optimizations.
3. Example test must pass before running against real input.
4. Benchmark both parts every run. Target under 100ms per part.

## Commands

- `make new D=01` create a day from templates.
- `make test D=01` run the example unit test.
- `make solve D=01` run against input.txt with timing.
- `pnpm test` run all tests.

## Rules

- `part1`/`part2` are pure functions of the raw input string.
- Never commit `input.txt`, `example.txt`, or `puzzle.md`.
- Prefer helpers in `src/utils` over re-implementing grid or graph logic per day.
