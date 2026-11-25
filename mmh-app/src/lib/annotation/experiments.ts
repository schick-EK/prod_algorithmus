import { annotateBatch } from "./batch";
import { EvidenceMode, PIPELINE_VERSION, RULESET_VERSION } from "./contracts";
import { evaluateAnnotations } from "./evaluation";
import { digest } from "./hash";
import { annotate } from "./pipeline";

/** Paired channel comparison on the same original observations/references.
 * Channels are disabled in the pipeline, never replaced with fabricated data. */
export function compareEvidenceChannels(
  inputs: unknown[],
  references: unknown[],
) {
  if (!inputs.length) throw new Error("At least one observation is required");
  const checked = annotateBatch(
    inputs.map((value, index) => ({ line: index + 1, value })),
  );
  if (checked.errors.length) throw new Error(checked.errors.join("\n"));
  const ordered = checked.results
    .map((r) => r.audit.input!)
    .sort((a, b) =>
      a.observation_id < b.observation_id
        ? -1
        : a.observation_id > b.observation_id
          ? 1
          : 0,
    );
  const variants = (
    ["observation_only", "memo_only", "combined"] as EvidenceMode[]
  ).map((mode) => {
    // No observer hint is permitted in any of these E1/E2 comparisons.
    const results = ordered.map((input) =>
      annotate(input, undefined, { mode, observerHint: false }),
    );
    return {
      mode,
      evaluation: evaluateAnnotations(results, references),
      observations: results.map((result) => ({
        observation_id: result.observation_id!,
        annotation_id: result.annotation_id,
        status: result.decision.status,
        channel_conflict: result.diagnostics.channel_conflict,
        supported_classes: result.candidates
          .filter((c) => c.raw_score > 0)
          .map((c) => c.class_id)
          .sort(),
        candidate_count: result.candidates.length,
        configuration: result.audit.configuration,
      })),
    };
  });
  const paired = ordered.map((input) => {
    const rows = variants.map(
      (v) =>
        v.observations.find(
          (row) => row.observation_id === input.observation_id,
        )!,
    );
    return {
      observation_id: input.observation_id,
      decision_changed: new Set(rows.map((row) => row.status)).size > 1,
      supported_classes_changed:
        new Set(rows.map((row) => JSON.stringify(row.supported_classes))).size >
        1,
      conflict_in_combined: rows[2].channel_conflict,
    };
  });
  const payload = {
    schema_version: "ap3-channel-comparison/0.1.0",
    versions: { pipeline: PIPELINE_VERSION, ruleset: RULESET_VERSION },
    input_sha256: digest(ordered),
    variants,
    paired,
  };
  return { report_id: `CMP_${digest(payload).slice(0, 32)}`, ...payload };
}
