import { AnnotationResult } from "./contracts";
import { annotate } from "./pipeline";

export interface JsonlRow {
  line: number;
  value: unknown;
}
export function parseJsonl(text: string): {
  rows: JsonlRow[];
  errors: string[];
} {
  const rows: JsonlRow[] = [];
  const errors: string[] = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      rows.push({ line: index + 1, value: JSON.parse(line) });
    } catch {
      errors.push(`Line ${index + 1}: invalid JSON`);
    }
  }
  return { rows, errors };
}

function observationId(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("observation_id" in value))
    return null;
  return typeof value.observation_id === "string" && value.observation_id.trim()
    ? value.observation_id
    : null;
}

/** In replay mode, require exactly one response per observation. Never fall back
 * silently to a rule-only run when an AI response is missing or duplicated. */
export function annotateBatch(
  inputs: JsonlRow[],
  responses?: JsonlRow[],
): { results: AnnotationResult[]; errors: string[] } {
  const errors: string[] = [];
  const byId = new Map<string, unknown>();
  const invalidIds = new Set<string>();
  for (const row of responses ?? []) {
    const id = observationId(row.value);
    if (!id) {
      errors.push(`AI line ${row.line}: observation_id required`);
      continue;
    }
    if (byId.has(id)) {
      errors.push(
        `AI line ${row.line}: duplicate observation_id ${JSON.stringify(id)}`,
      );
      invalidIds.add(id);
    } else byId.set(id, row.value);
  }
  const seen = new Set<string>();
  const results: AnnotationResult[] = [];
  for (const row of inputs) {
    const id = observationId(row.value);
    if (id && seen.has(id)) {
      errors.push(
        `Line ${row.line}: duplicate observation_id ${JSON.stringify(id)}`,
      );
      continue;
    }
    if (id) seen.add(id);
    if (responses && id && (!byId.has(id) || invalidIds.has(id))) {
      errors.push(
        `Line ${row.line}: exactly one AI response required for ${JSON.stringify(id)}`,
      );
      continue;
    }
    const result = annotate(row.value, id ? byId.get(id) : undefined);
    results.push(result);
    if (result.decision.status === "INVALID_INPUT")
      errors.push(
        `Line ${row.line}: ${result.diagnostics.input_errors.join("; ")}`,
      );
  }
  for (const id of byId.keys())
    if (!seen.has(id))
      errors.push(`AI response has no observation: ${JSON.stringify(id)}`);
  return { results, errors };
}
