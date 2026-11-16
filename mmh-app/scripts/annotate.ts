import { readFile } from "node:fs/promises";
import { annotateBatch, parseJsonl } from "../src/lib/annotation/batch";
import { buildAiRequest } from "../src/lib/annotation/controlled-ai";

async function main() {
  const args = process.argv.slice(2);
  const aiRequest = args[0] === "--ai-request";
  if (aiRequest) args.shift();
  const inputPath = args.shift();
  let responsePath: string | undefined;
  if (args[0] === "--ai-responses" && args.length === 2 && !aiRequest) {
    args.shift();
    responsePath = args.shift();
  }
  if (!inputPath || inputPath.startsWith("--") || args.length)
    throw new Error(
      "Usage: ap3:annotate -- <inputs.jsonl> [--ai-responses <responses.jsonl>] or ap3:ai-request -- <inputs.jsonl>",
    );
  const inputs = parseJsonl(await readFile(inputPath, "utf8"));
  const responses =
    responsePath !== undefined
      ? parseJsonl(await readFile(responsePath, "utf8"))
      : undefined;
  const batch = annotateBatch(inputs.rows, responses?.rows);
  const errors = [
    ...inputs.errors,
    ...(responses?.errors.map((e) => `AI ${e}`) ?? []),
    ...batch.errors,
  ];
  for (const error of errors) process.stderr.write(`${error}\n`);
  for (const result of batch.results) {
    if (aiRequest) {
      if (result.decision.status !== "INVALID_INPUT")
        process.stdout.write(
          `${JSON.stringify(buildAiRequest(result.audit.input!, result.audit.initial_candidate_ids))}\n`,
        );
    } else process.stdout.write(`${JSON.stringify(result)}\n`);
  }
  if (errors.length) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
