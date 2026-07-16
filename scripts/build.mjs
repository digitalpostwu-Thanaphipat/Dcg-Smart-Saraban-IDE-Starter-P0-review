/**
 * Bundle server entry for future Apps Script V8 (IIFE).
 * Phase 1: local build only — no clasp push.
 */
import * as esbuild from "esbuild";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outdir = path.join(root, "dist", "apps-script");

mkdirSync(outdir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(root, "apps-script", "server", "entry", "router.ts")],
  bundle: true,
  outfile: path.join(outdir, "server.bundle.js"),
  format: "iife",
  platform: "neutral",
  target: ["es2020"],
  legalComments: "none",
  logLevel: "info",
});

console.log("[build] OK → dist/apps-script/server.bundle.js (mock scaffold, no deploy)");
