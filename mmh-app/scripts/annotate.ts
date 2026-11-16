import { readFile } from "node:fs/promises";
import { annotate } from "../src/lib/annotation/pipeline";
import { buildAiRequest } from "../src/lib/annotation/controlled-ai";

async function main() {
  const args = process.argv.slice(2);
  const aiRequest = args[0] === "--ai-request";
  if (aiRequest) args.shift();
  if (args.length !== 1 || args[0].startsWith("--")) throw new Error("Usage: npm run ap3:annotate -- <observations.jsonl> (or npm run ap3:ai-request -- <observations.jsonl>)");
  const lines = (await readFile(args[0], "utf8")).split(/\r?\n/);
  const seen = new Set<string>();
  let failed = false;
  for (const [index, line] of lines.entries()) {
    if (!line.trim()) continue;
    let value: unknown;
    try { value = JSON.parse(line); }
    catch { process.stderr.write(`Line ${index + 1}: invalid JSON\n`); failed = true; continue; }
    const result = annotate(value);
    const id = result.observation_id;
    if (id && seen.has(id)) {
      process.stderr.write(`Line ${index + 1}: duplicate observation_id ${JSON.stringify(id)}\n`);
      failed = true;
      continue;
    }
    if (id) seen.add(id);
    if (result.decision.status === "INVALID_INPUT") {
      process.stderr.write(`Line ${index + 1}: ${result.diagnostics.input_errors.join("; ")}\n`);
      failed = true;
    }
    if (aiRequest) {
      if (result.decision.status !== "INVALID_INPUT") process.stdout.write(`${JSON.stringify(buildAiRequest(result.audit.input!, result.audit.initial_candidate_ids))}\n`);
    } else process.stdout.write(`${JSON.stringify(result)}\n`);
  }
  if (failed) process.exitCode = 1;
}

main().catch(error => { process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 1; });
