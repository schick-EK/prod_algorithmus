import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { AnnotationInput } from "../src/lib/annotation/contracts";
import { parseJsonl } from "../src/lib/annotation/batch";
import { annotate } from "../src/lib/annotation/pipeline";
import { compareEvidenceChannels } from "../src/lib/annotation/experiments";

const path = join(import.meta.dirname, "fixtures/ap3/observations.jsonl");
const referencePath = join(
  import.meta.dirname,
  "fixtures/ap3/references.jsonl",
);
const inputs = parseJsonl(readFileSync(path, "utf8")).rows.map(
  (r) => r.value as AnnotationInput,
);
const refs = parseJsonl(readFileSync(referencePath, "utf8")).rows.map(
  (r) => r.value,
);
function memo(text: string) {
  const input = structuredClone(inputs[5]);
  input.memo = {
    status: "available",
    scope: "observation",
    text,
    source_ids: ["TEST_MEMO"],
  };
  return input;
}

for (const [text, id, score] of [
  ["Material ist vorhanden.", "PS_WAIT_MATERIAL", -0.7],
  ["Wartet auf die Maschine.", "PS_WAIT_MACHINE", 0.7],
  ["Personal fehlt.", "PS_WAIT_PERSONNEL", 0.7],
  ["Vorprozess ist noch nicht abgeschlossen.", "PS_WAIT_PREVIOUS_PROCESS", 0.7],
  ["Geplanter Werkzeugwechsel.", "PS_SETUP", 0.7],
  ["Geplante Produktprüfung.", "PS_INSPECTION", 0.7],
] as const) {
  test(`new memo baseline: ${text}`, () => {
    const input = memo(text);
    const result = annotate(input);
    const contribution = result.audit.evidence.find((e) => e.class_id === id);
    assert.equal(contribution?.score, score);
    assert.equal(
      input.memo.text!.slice(
        contribution!.span!.start,
        contribution!.span!.end,
      ),
      contribution!.span!.text,
    );
    assert.equal(result.candidate_distribution, null);
    assert.equal(result.resolved, null);
  });
}

for (const text of [
  "Material ist nicht vorhanden.",
  "Falls Personal fehlt.",
  "Geplanter Werkzeugwechsel?",
  "Gestern geplante Produktprüfung.",
  "Wenn Material fehlt.",
]) {
  test(`qualified memo creates no unconditional evidence: ${text}`, () => {
    assert.deepEqual(annotate(memo(text)).audit.evidence, []);
  });
}

test("both machine contradictions preserve verbatim spans without forcing a class", () => {
  for (const [observed, text] of [
    ["running", "Maschine steht."],
    ["stopped", "Maschine läuft."],
  ] as const) {
    const input = memo(text);
    input.structured_features.machine_status = observed;
    input.missingness.machine_status = "present";
    const result = annotate(input);
    assert.equal(result.decision.status, "ABSTAIN_CONFLICTING_EVIDENCE");
    assert.equal(result.audit.channel_conflicts.length, 1);
    assert.equal(
      result.audit.channel_conflicts[0].span.text,
      text.slice(0, -1),
    );
    assert.equal(
      annotate(input, undefined, { mode: "memo_only" }).diagnostics
        .channel_conflict,
      false,
    );
    assert.equal(
      annotate(input, undefined, { mode: "observation_only" }).diagnostics
        .channel_conflict,
      false,
    );
  }
});

test("material memo counterevidence is retained alongside the observed shortage", () => {
  const input = memo("Material ist vorhanden.");
  input.structured_features.operator_activity = "waiting";
  input.structured_features.material_status = "not_available";
  input.missingness.operator_activity = "present";
  input.missingness.material_status = "present";
  const result = annotate(input);
  assert.equal(result.decision.status, "ABSTAIN_CONFLICTING_EVIDENCE");
  assert.ok(
    result.audit.evidence.some(
      (e) => e.class_id === "PS_WAIT_MATERIAL" && e.score > 0,
    ),
  );
  assert.ok(
    result.audit.evidence.some(
      (e) => e.class_id === "PS_WAIT_MATERIAL" && e.score < 0,
    ),
  );
});

test("channel ablations retain the original input and have independent identities", () => {
  const input = structuredClone(inputs[1]);
  const original = structuredClone(input);
  const observation = annotate(input, undefined, { mode: "observation_only" });
  const text = annotate(input, undefined, { mode: "memo_only" });
  assert.ok(
    observation.audit.evidence.every((e) => e.channel === "E1_STRUCTURED"),
  );
  assert.ok(text.audit.evidence.every((e) => e.channel === "E2_MEMO"));
  assert.deepEqual(input, original);
  assert.deepEqual(text.audit.input, original);
  assert.equal(text.audit.input_sha256, observation.audit.input_sha256);
  assert.notEqual(text.annotation_id, observation.annotation_id);
  assert.equal(
    annotate(input, {}, { mode: "memo_only" }).decision.status,
    "INVALID_INPUT",
  );
});

test("paired comparison is order invariant and excludes observer hints in every variant", () => {
  const report = compareEvidenceChannels(inputs, refs);
  assert.deepEqual(
    compareEvidenceChannels([...inputs].reverse(), [...refs].reverse()),
    report,
  );
  assert.equal(report.variants.length, 3);
  for (const variant of report.variants) {
    assert.equal(variant.observations.length, inputs.length);
    assert.ok(
      variant.observations.every(
        (row) => row.configuration.observer_hint === false,
      ),
    );
    assert.equal(variant.evaluation.calibration_metrics.brier_score, null);
  }
  assert.ok(report.paired.some((row) => row.supported_classes_changed));
  const noMemo = report.variants[1].evaluation.cases.find(
    (c) => c.observation_id === "SYN_001",
  )!;
  assert.equal(noMemo.candidate_hit, true);
  assert.equal(noMemo.supported_candidate_hit, false);
  assert.throws(() => compareEvidenceChannels([], []));
  assert.throws(() => compareEvidenceChannels(inputs, refs.slice(1)));
  assert.throws(() => compareEvidenceChannels([...inputs, inputs[0]], refs));
});

test("comparison CLI produces a complete report and rejects unmatched reference sets", () => {
  const run = (reference: string) =>
    spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/compare-channels.ts", path, reference],
      { encoding: "utf8" },
    );
  const good = run(referencePath);
  assert.equal(good.status, 0, good.stderr);
  assert.equal(JSON.parse(good.stdout).variants.length, 3);
  const bad = run(path);
  assert.equal(bad.status, 1);
  assert.equal(bad.stdout, "");
});
