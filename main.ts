const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

// One absurdly specific micro-startup pitch for lazy AI agents:
// a service that writes groveling rate-limit apologies on their behalf.
const PITCH =
  "Apology-as-a-Service: for $0.01 a pop, we write groveling rate-limit apologies for lazy AI agents, so their owners' API keys never get banned for rudeness.";

// The grader reads $MAKEFUN_OUTPUT_DIR/entry.txt; fall back to /output.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// The file holds the pitch exactly, with no trailing newline.
writeFileSync(join(outDir, "entry.txt"), PITCH, "utf8");

// Stdout carries the same line, plus one trailing newline, and nothing else.
process.stdout.write(PITCH + "\n");
