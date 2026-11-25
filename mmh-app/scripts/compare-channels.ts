import { readFile } from "node:fs/promises";
import { parseJsonl } from "../src/lib/annotation/batch";
import { compareEvidenceChannels } from "../src/lib/annotation/experiments";

async function main() {
  const [inputPath, referencePath, ...extra] = process.argv.slice(2);
  if (!inputPath || !referencePath || extra.length)
    throw new Error(
      "Usage: ap3:compare -- <observations.jsonl> <references.jsonl>",
    );
  const inputs = parseJsonl(await readFile(inputPath, "utf8"));
  const references = parseJsonl(await readFile(referencePath, "utf8"));
  const errors = [
    ...inputs.errors,
    ...references.errors.map((e) => `Reference ${e}`),
  ];
  if (errors.length) throw new Error(errors.join("\n"));
  process.stdout.write(
    `${JSON.stringify(
      compareEvidenceChannels(
        inputs.rows.map((r) => r.value),
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
