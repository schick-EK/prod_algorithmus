import { readFile } from "node:fs/promises";
import { annotateBatch, parseJsonl } from "../src/lib/annotation/batch";
import { evaluateAnnotations } from "../src/lib/annotation/evaluation";

async function main() {
  const [inputPath, referencePath, flag, responsePath, ...extra] =
    process.argv.slice(2);
  if (
    !inputPath ||
    !referencePath ||
    extra.length ||
    (flag !== undefined && (flag !== "--ai-responses" || !responsePath))
  )
    throw new Error(
      "Usage: ap3:evaluate -- <inputs.jsonl> <references.jsonl> [--ai-responses <responses.jsonl>]",
    );
  const inputs = parseJsonl(await readFile(inputPath, "utf8"));
  const references = parseJsonl(await readFile(referencePath, "utf8"));
  const responses = responsePath
    ? parseJsonl(await readFile(responsePath, "utf8"))
    : undefined;
  const batch = annotateBatch(inputs.rows, responses?.rows);
  const errors = [
    ...inputs.errors,
    ...references.errors.map((e) => `Reference ${e}`),
    ...(responses?.errors.map((e) => `AI ${e}`) ?? []),
    ...batch.errors,
  ];
  if (errors.length) throw new Error(errors.join("\n"));
  process.stdout.write(
    `${JSON.stringify(
      evaluateAnnotations(
        batch.results,
        references.rows.map((r) => r.value),
      ),
      null,
      2,
    )}\n`,
  );
}
main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
