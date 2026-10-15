# Advent of Code task runner.
# Usage:
#   make new D=01     scaffold days/day01 from templates
#   make test D=01    run the example unit test for day01
#   make solve D=01   run day01 against input.txt with timing
#   make test         run every test
#   make typecheck    type-check the whole project

.PHONY: new fetch test solve typecheck install help
.DEFAULT_GOAL := help

# Normalize D: allow D=1 or D=01, pad to two digits.
PAD = $(shell printf '%02d' $(D) 2>/dev/null)
# YEAR defaults to AOC_YEAR env or 2025.
YEAR ?= $(or $(AOC_YEAR),2025)

install:
	pnpm install

new:
ifndef D
	$(error D is required, e.g. make new D=01)
endif
	pnpm new $(D)

fetch:
ifndef D
	$(error D is required, e.g. make fetch D=01 YEAR=2025)
endif
	pnpm fetch $(D) $(YEAR)

test:
ifdef D
	pnpm vitest run days/day$(PAD)
else
	pnpm test
endif

solve:
ifndef D
	$(error D is required, e.g. make solve D=01)
endif
	pnpm solve $(D)

typecheck:
	pnpm typecheck

help:
	@echo "Advent of Code targets:"
	@echo "  make new D=01     scaffold a new day"
	@echo "  make fetch D=01 YEAR=2025  download input.txt (needs AOC_SESSION in .env)"
	@echo "  make test D=01    run one day's example test"
	@echo "  make test         run all tests"
	@echo "  make solve D=01   run against input.txt with timing"
	@echo "  make typecheck    type-check the project"
	@echo "  make install      install dependencies"
