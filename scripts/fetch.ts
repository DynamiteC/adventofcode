#!/usr/bin/env tsx
/**
 * Puzzle fetcher. Usage: make fetch D=01 YEAR=2025  (or pnpm fetch 01 2025)
 *
 * Downloads two things using the AOC_SESSION cookie from .env:
 *   - your personal puzzle input    -> days/dayXX/input.txt
 *   - the puzzle prose as Markdown   -> days/dayXX/puzzle.md
 *
 * Both files are gitignored: input is per-account and not for redistribution,
 * and puzzle prose is AoC's copyrighted text.
 *
 * Politeness: skips a file that already has content so repeated runs do not
 * hammer the AoC servers. Pass FORCE=1 to refetch (e.g. to pull Part 2 prose
 * into puzzle.md after unlocking it).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const USER_AGENT = "github.com/shailsheth/adventofcode via kiro-cli";

function loadEnv(): void {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function normalizeDay(raw: string | undefined): string {
  const n = Number(raw);
  if (!raw || !Number.isInteger(n) || n < 1 || n > 25) {
    console.error(`Invalid day "${raw ?? ""}". Expected an integer 1-25.`);
    process.exit(1);
  }
  return String(n).padStart(2, "0");
}

/** Decode the handful of HTML entities AoC uses in puzzle prose. */
function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Convert one AoC <article class="day-desc"> block to Markdown. Preserves
 * code spans, code blocks, emphasis, headings, and list items; strips the
 * rest of the markup. Deliberately small: AoC prose uses a narrow tag set.
 */
function articleToMarkdown(html: string): string {
  let md = html;

  // Code blocks first, so inner tags are not mangled by later rules.
  md = md.replace(/<pre>\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/g, (_m, code: string) => {
    return `\n\`\`\`\n${decodeEntities(code.replace(/<[^>]+>/g, "")).replace(/\n+$/, "")}\n\`\`\`\n`;
  });

  // Inline code.
  md = md.replace(/<code>([\s\S]*?)<\/code>/g, (_m, code: string) => {
    return "`" + decodeEntities(code.replace(/<[^>]+>/g, "")) + "`";
  });

  // Headings (AoC uses h2 for the title).
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (_m, t: string) => `\n## ${t.trim()}\n`);

  // Emphasis: <em class="star"> is the puzzle's gold-star emphasis.
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/g, (_m, t: string) => `**${t.trim()}**`);

  // Lists.
  md = md.replace(/<li>([\s\S]*?)<\/li>/g, (_m, t: string) => `- ${t.trim()}\n`);
  md = md.replace(/<\/?ul>/g, "\n");

  // Paragraphs and line breaks become blank lines / newlines.
  md = md.replace(/<\/p>/g, "\n\n").replace(/<p>/g, "");
  md = md.replace(/<br\s*\/?>/g, "\n");

  // Links: keep the text, drop the href.
  md = md.replace(/<a[^>]*>([\s\S]*?)<\/a>/g, (_m, t: string) => t);

  // Strip anything left, decode entities, collapse excess blank lines.
  md = md.replace(/<[^>]+>/g, "");
  md = decodeEntities(md);
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

/** Extract and convert every <article class="day-desc"> block on the page. */
function pageToMarkdown(html: string): string {
  const articles = [...html.matchAll(/<article class="day-desc">([\s\S]*?)<\/article>/g)];
  if (articles.length === 0) return "";
  return articles.map((m) => articleToMarkdown(m[1]!)).join("\n\n---\n\n") + "\n";
}

async function fetchPage(url: string, session: string): Promise<Response> {
  return fetch(url, {
    headers: { Cookie: `session=${session}`, "User-Agent": USER_AGENT },
  });
}

function describeHttpError(status: number): string {
  if (status === 400 || status === 500)
    return "Your AOC_SESSION may be expired. Grab a fresh cookie and update .env.";
  if (status === 404) return "Puzzle not available yet (not unlocked, or wrong YEAR/D).";
  return "";
}

loadEnv();

const day = normalizeDay(process.argv[2]);
const dayNum = Number(day);
const year = Number(process.argv[3] ?? process.env.AOC_YEAR ?? 2025);
const session = process.env.AOC_SESSION;
const force = Boolean(process.env.FORCE);

if (!session) {
  console.error(
    "AOC_SESSION is not set. Copy .env.example to .env and paste your session cookie.",
  );
  process.exit(1);
}

const dayDir = join(root, "days", `day${day}`);
mkdirSync(dayDir, { recursive: true });
const inputPath = join(dayDir, "input.txt");
const puzzlePath = join(dayDir, "puzzle.md");

function hasContent(path: string): boolean {
  return existsSync(path) && readFileSync(path, "utf8").trim() !== "";
}

// --- Fetch puzzle prose -> puzzle.md ---
if (hasContent(puzzlePath) && !force) {
  console.log(`days/day${day}/puzzle.md already populated. Pass FORCE=1 to refetch.`);
} else {
  const url = `https://adventofcode.com/${year}/day/${dayNum}`;
  console.log(`Fetching puzzle ${url} ...`);
  const res = await fetchPage(url, session);
  if (!res.ok) {
    console.error(`Puzzle fetch failed: ${res.status} ${res.statusText}`);
    const hint = describeHttpError(res.status);
    if (hint) console.error(hint);
    process.exit(1);
  }
  const md = pageToMarkdown(await res.text());
  if (md === "") {
    console.error("No <article class=\"day-desc\"> found. Page layout may have changed.");
    process.exit(1);
  }
  writeFileSync(puzzlePath, md);
  console.log(`Saved ${md.length} bytes to days/day${day}/puzzle.md`);
}

// --- Fetch personal input -> input.txt ---
if (hasContent(inputPath) && !force) {
  console.log(`days/day${day}/input.txt already populated. Pass FORCE=1 to refetch.`);
} else {
  const url = `https://adventofcode.com/${year}/day/${dayNum}/input`;
  console.log(`Fetching input ${url} ...`);
  const res = await fetchPage(url, session);
  if (!res.ok) {
    const body = (await res.text()).trim().slice(0, 200);
    console.error(`Input fetch failed: ${res.status} ${res.statusText}\n${body}`);
    const hint = describeHttpError(res.status);
    if (hint) console.error(hint);
    process.exit(1);
  }
  const body = await res.text();
  writeFileSync(inputPath, body);
  console.log(`Saved ${body.length} bytes to days/day${day}/input.txt`);
}
