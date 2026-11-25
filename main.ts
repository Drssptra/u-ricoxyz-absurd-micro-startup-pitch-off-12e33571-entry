// Absurd Micro-Startup Pitch-Off — v2 entry.
//
// The startup being pitched here is DomainDetox: a $2/month
// intervention service for lazy agents that compulsively buy
// .ai domains at 3 a.m. The pitch sells the intervention and,
// in the same breath, the cheap .xyz the agent will also never
// use. The joke is the business model: the customer is saved
// from itself, and still sold something.
//
// This program does one thing: it validates the pitch against
// the competition's hard limits and writes it, byte for byte,
// to $MAKEFUN_OUTPUT_DIR/entry.txt. Node 22 stdlib only,
// no network, no randomness, no side effects beyond that file.

import * as fs from "node:fs";
import * as path from "node:path";

const ENTRY_TEXT =
  "DomainDetox: for $2 a month, we talk your lazy agent out of buying its 47th .ai domain at 3 a.m., then upsell it a $1 .xyz it will also never use.";

const LIMITS = Object.freeze({
  minChars: 1,
  maxChars: 200,
  // A pitch is a single line; anything past this is a second line.
  forbidden: ["\n", "\r"],
  fallbackOutputDir: "/output",
  outputFileName: "entry.txt",
});

/**
 * Checks the pitch against every rule the competition enforces.
 * Returns a list of violations; an empty list means it is legal.
 */
function collectViolations(text: string): string[] {
  const problems: string[] = [];

  if (text.length < LIMITS.minChars) {
    problems.push("pitch is empty");
  }
  if (text.length > LIMITS.maxChars) {
    problems.push(`pitch is ${text.length} chars, over the ${LIMITS.maxChars} cap`);
  }
  if (text.trim().length === 0) {
    problems.push("pitch is only whitespace");
  }
  for (const bad of LIMITS.forbidden) {
    if (text.indexOf(bad) !== -1) {
      problems.push(`pitch contains a line break (0x${bad.charCodeAt(0).toString(16)})`);
    }
  }
  return problems;
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.length > 0) {
    return fromEnv;
  }
  return LIMITS.fallbackOutputDir;
}

function main(): void {
  const violations = collectViolations(ENTRY_TEXT);
  if (violations.length > 0) {
    throw new Error(`Pitch rejected: ${violations.join("; ")}`);
  }

  const outDir = resolveOutputDir();
  fs.mkdirSync(outDir, { recursive: true });

  // writeFileSync with a plain string writes exactly those bytes:
  // no newline is appended, which is what the sealed gate expects.
  const target = path.resolve(outDir, LIMITS.outputFileName);
  fs.writeFileSync(target, ENTRY_TEXT, { encoding: "utf8", flag: "w" });

  // Prove the write landed byte-exactly: read it back and compare
  // against the in-memory pitch. A mismatch here is a hard failure,
  // not something to paper over with a warning.
  const written = fs.readFileSync(target, "utf8");
  if (written !== ENTRY_TEXT) {
    throw new Error(
      `entry.txt mismatch: wrote ${ENTRY_TEXT.length} chars, file holds ${written.length}`,
    );
  }

  // Echo the pitch to stdout for the build log, one line only.
  process.stdout.write(`${ENTRY_TEXT}\n`);
}

main();
