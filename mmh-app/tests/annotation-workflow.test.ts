import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { AnnotationInput } from "../src/lib/annotation/contracts";
import { annotate } from "../src/lib/annotation/pipeline";
import { annotateBatch, parseJsonl } from "../src/lib/annotation/batch";
import {
  buildAiRequest,
  PROMPT_VERSION,
} from "../src/lib/annotation/controlled-ai";
import { buildAnnotationBundle } from "../src/lib/annotation/bundle";
import {
  evaluateAnnotations,
  ReferenceAnnotation,
} from "../src/lib/annotation/evaluation";
import { digest } from "../src/lib/annotation/hash";
import { ontology } from "../src/lib/annotation/ontology";

const inputPath = join(import.meta.dirname, "fixtures/ap3/observations.jsonl");
const referencePath = join(
  import.meta.dirname,
  "fixtures/ap3/references.jsonl",
);
const inputRows = parseJsonl(readFileSync(inputPath, "utf8")).rows;
const inputs = inputRows.map((r) => r.value as AnnotationInput);
const references = parseJsonl(readFileSync(referencePath, "utf8")).rows.map(
  (r) => r.value as ReferenceAnnotation,
);

function responses() {
  return inputs.map((input) => ({
    observation_id: input.observation_id,
    input_sha256: digest(input),
    request_sha256: buildAiRequest(
      input,
      annotate(input).audit.initial_candidate_ids,
    ).request_sha256,
    prompt_version: PROMPT_VERSION,
    model_id: "synthetic-replay/no-model-call",
    scores: [],
  }));
}
const rows = (values: unknown[]) =>
  values.map((value, index) => ({ line: index + 1, value }));

test("counterevidence alone preserves other families and all negative targets stay visible", () => {
  const input = structuredClone(inputs[5]);
  input.structured_features.material_status = "available";
  input.missingness.material_status = "present";
  let result = annotate(input);
  assert.equal(result.candidates.length, ontology.classes.length);
  assert.equal(result.decision.status, "ABSTAIN_INSUFFICIENT_EVIDENCE");
  input.structured_features.operator_activity = "processing";
  input.missingness.operator_activity = "present";
  result = annotate(input);
  assert.ok(
    result.candidates.some(
      (c) => c.class_id === "PS_WAIT_MATERIAL" && c.raw_score < 0,
    ),
  );
  assert.ok(result.candidates.some((c) => c.class_id === "PS_WAITING"));
});

test("unknown observer hint does not close the candidate space", () => {
  const input = structuredClone(inputs[5]);
  input.observer_hint = { candidate_class_id: "PS_UNKNOWN" };
  assert.equal(annotate(input).candidates.length, ontology.classes.length);
});

test("invalid evidence attempts have distinct content identities and remain auditable", () => {
  const response = responses()[1];
  response.input_sha256 = "stale";
  const invalid = annotate(inputs[1], response);
  assert.equal(invalid.decision.status, "INVALID_INPUT");
  assert.equal(invalid.audit.ai_response_valid, false);
  assert.deepEqual(invalid.audit.ai_response, response);
  response.input_sha256 = "another stale snapshot";
  assert.notEqual(
    annotate(inputs[1], response).annotation_id,
    invalid.annotation_id,
  );
  assert.notEqual(
    annotate({ observation_id: "A" }).annotation_id,
    annotate({ observation_id: "B" }).annotation_id,
  );
  assert.equal(annotate(undefined).decision.status, "INVALID_INPUT");
});

test("AI batch replay joins responses by ID, not by file order", () => {
  const batch = annotateBatch(inputRows, rows(responses().reverse()));
  assert.deepEqual(batch.errors, []);
  assert.equal(batch.results.length, inputs.length);
  assert.ok(batch.results.every((r) => r.audit.ai_response_valid === true));
  assert.ok(
    batch.results.every(
      (r) => r.candidate_distribution === null && r.decision.abstain,
    ),
  );
  assert.deepEqual(
    annotateBatch(inputRows, rows(responses())).results,
    batch.results,
  );
});

test("replay cannot silently omit, duplicate, or attach foreign responses", () => {
  for (const values of [
    responses().slice(1),
    [...responses(), responses()[0]],
    [...responses(), { ...responses()[0], observation_id: "FOREIGN" }],
  ]) {
    const batch = annotateBatch(inputRows, rows(values));
    assert.ok(batch.errors.length);
  }
  const values = responses();
  values[0].input_sha256 = "wrong";
  assert.equal(
    annotateBatch(inputRows, rows(values)).results[0].decision.status,
    "INVALID_INPUT",
  );
});

test("evaluation distinguishes class references, expected abstain, origins and empty denominators", () => {
  const report = evaluateAnnotations(
    inputs.map((i) => annotate(i)),
    references,
  );
  assert.equal(report.by_reference_source.synthetic.observations, 10);
  assert.equal(report.by_reference_source.synthetic.class_reference_cases, 4);
  assert.equal(
    report.by_reference_source.synthetic.expected_abstain_match_rate,
    1,
  );
  assert.equal(report.by_reference_source.synthetic.coverage, 0);
  assert.equal(report.by_reference_source.synthetic.error_on_accepted, null);
  assert.equal(report.by_reference_source.human_reviewed.observations, 0);
  assert.equal(
    report.by_reference_source.human_reviewed.candidate_hit_rate,
    null,
  );
  assert.equal(report.calibration_metrics.brier_score, null);
  assert.deepEqual(
    evaluateAnnotations(
      inputs.map((i) => annotate(i)).reverse(),
      [...references].reverse(),
    ),
    report,
  );
});

test("parent references accept descendant ranking only when requested", () => {
  const ref = structuredClone(references[3]);
  ref.observation_id = inputs[7].observation_id;
  ref.reference = {
    kind: "class_set",
    class_ids: ["PS_LOSS"],
    accept_descendants: true,
  };
  assert.equal(
    evaluateAnnotations([annotate(inputs[7])], [ref]).cases[0].raw_top1_hit,
    true,
  );
  ref.reference.accept_descendants = false;
  assert.equal(
    evaluateAnnotations([annotate(inputs[7])], [ref]).cases[0].raw_top1_hit,
    false,
  );
});

test("out-of-scope references remain explicitly unevaluated", () => {
  const ref = structuredClone(references[0]);
  ref.reference = { kind: "out_of_scope" };
  const report = evaluateAnnotations([annotate(inputs[0])], [ref]);
  assert.equal(
    report.by_reference_source.synthetic.out_of_scope_reference_cases,
    1,
  );
  assert.equal(
    report.by_reference_source.synthetic.out_of_scope_match_rate,
    null,
  );
  assert.equal(report.by_reference_source.synthetic.candidate_hit_rate, null);
});

test("evaluation rejects unmatched labels, unknown classes, duplicates and group leakage", () => {
  const results = inputs.map((i) => annotate(i));
  assert.throws(
    () => evaluateAnnotations(results, references.slice(1)),
    /exactly one/,
  );
  assert.throws(() =>
    evaluateAnnotations(results, [...references, references[0]]),
  );
  const unknown = structuredClone(references);
  unknown[0].reference = {
    kind: "class_set",
    class_ids: ["FOREIGN"],
    accept_descendants: false,
  };
  assert.throws(() => evaluateAnnotations(results, unknown));
  const leaked = structuredClone(references);
  leaked[9].group_id = leaked[0].group_id;
  assert.throws(() => evaluateAnnotations(results, leaked), /leakage/);
  const empirical = structuredClone(references);
  empirical[0].source = "human_reviewed";
  assert.throws(() => evaluateAnnotations(results, empirical), /Synthetic/);
  assert.throws(() =>
    evaluateAnnotations(
      results,
      references.map((ref, index) =>
        index === 0 ? { ...ref, source: ["synthetic"] } : ref,
      ),
    ),
  );
  assert.throws(() =>
    evaluateAnnotations(
      results,
      references.map((ref, index) =>
        index === 0 ? { ...ref, split: ["development"] } : ref,
      ),
    ),
  );
});

test("shared memo sources cannot cross dataset splits under different group names", () => {
  const examples = [structuredClone(inputs[0]), structuredClone(inputs[6])];
  examples.forEach((i) => {
    i.memo = {
      status: "available",
      text: "Material fehlt.",
      scope: "station_round",
      source_ids: ["SHARED"],
    };
  });
  const refs = [references[0], references[6]];
  assert.throws(
    () =>
      evaluateAnnotations(
        examples.map((i) => annotate(i)),
        refs,
      ),
    /Shared memo/,
  );
});

test("bundle hashes bind inputs, results and the ontology snapshot", () => {
  const bundle = buildAnnotationBundle(inputs);
  assert.equal(bundle.manifest.observation_count, 10);
  assert.equal(bundle.manifest.hashes.inputs, digest(bundle.inputs));
  assert.equal(
    bundle.manifest.hashes.content,
    digest({
      inputs: bundle.inputs,
      annotations: bundle.annotations,
      ontology: bundle.ontology,
    }),
  );
  assert.deepEqual(buildAnnotationBundle(inputs), bundle);
  const changed = structuredClone(inputs);
  changed[0].observation_quality.level = "low";
  assert.notEqual(
    buildAnnotationBundle(changed).manifest.hashes.content,
    bundle.manifest.hashes.content,
  );
  assert.ok(
    buildAiRequest(inputs[0], annotate(inputs[0]).audit.initial_candidate_ids)
      .candidates.length,
  );
});

test("replay and evaluation CLIs work without remote AI and fail unsuccessful runs", () => {
  const dir = mkdtempSync(join(tmpdir(), "ap3-workflow-"));
  try {
    const replayPath = join(dir, "responses.jsonl");
    writeFileSync(
      replayPath,
      responses()
        .map((r) => JSON.stringify(r))
        .join("\n"),
    );
    const run = (script: string, args: string[]) =>
      spawnSync(process.execPath, ["--import", "tsx", script, ...args], {
        encoding: "utf8",
      });
    const replay = run("scripts/annotate.ts", [
      inputPath,
      "--ai-responses",
      replayPath,
    ]);
    assert.equal(replay.status, 0, replay.stderr);
    assert.equal(
      run("scripts/annotate.ts", [inputPath, "--ai-responses", ""]).status,
      1,
    );
    assert.equal(replay.stdout.trim().split("\n").length, 10);
    const evaluation = run("scripts/evaluate-annotations.ts", [
      inputPath,
      referencePath,
      "--ai-responses",
      replayPath,
    ]);
    assert.equal(evaluation.status, 0, evaluation.stderr);
    assert.equal(
      JSON.parse(evaluation.stdout).by_reference_source.synthetic.observations,
      10,
    );
    writeFileSync(replayPath, "");
    assert.equal(
      run("scripts/annotate.ts", [inputPath, "--ai-responses", replayPath])
        .status,
      1,
    );
    const bad = run("scripts/evaluate-annotations.ts", [
      inputPath,
      referencePath,
      "--ai-responses",
      replayPath,
    ]);
    assert.equal(bad.status, 1);
    assert.equal(bad.stdout, "");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
