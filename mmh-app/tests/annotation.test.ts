import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { AnnotationInput } from "../src/lib/annotation/contracts";
import { annotate } from "../src/lib/annotation/pipeline";
import { ontology, validateOntology } from "../src/lib/annotation/ontology";
import { adaptLegacyObservation, LegacyObservation } from "../src/lib/annotation/legacy-adapter";
import { AiResponse, buildAiRequest, PROMPT_VERSION } from "../src/lib/annotation/controlled-ai";
import { digest } from "../src/lib/annotation/hash";
import expectations from "./fixtures/ap3/expectations.json";

const fixturePath = join(import.meta.dirname, "fixtures/ap3/observations.jsonl");
const fixtures = readFileSync(fixturePath, "utf8").trim().split("\n").map(line => JSON.parse(line) as AnnotationInput);
const example = () => structuredClone(fixtures[0]);
const supported = (input: unknown) => annotate(input).audit.evidence.filter(e => e.score > 0).map(e => e.class_id);

for (const expected of expectations.cases) {
  test(`synthetic scenario ${expected.observation_id}: ${expected.status}`, () => {
    const input = fixtures.find(v => v.observation_id === expected.observation_id)!;
    const result = annotate(input);
    assert.equal(result.decision.status, expected.status);
    assert.equal(result.candidate_distribution, null);
    assert.equal(result.resolved, null);
    assert.equal(result.decision.abstain, true);
    assert.equal(result.diagnostics.out_of_scope, null);
    assert.ok(result.candidates.some(c => c.class_id === "PS_UNKNOWN"));
    for (const id of expected.must_support) assert.ok(supported(input).includes(id), `missing support: ${id}`);
    for (const id of expected.must_not_support) assert.ok(!supported(input).includes(id), `unexpected support: ${id}`);
  });
}

test("waiting alone preserves alternatives and hierarchy without inventing a fine label", () => {
  const result = annotate(example());
  assert.ok(result.candidates.some(c => c.class_id === "PS_WAIT_INFORMATION"));
  assert.ok(result.candidates.some(c => c.class_id === "PS_WAIT_MATERIAL" && c.raw_score === 0));
  assert.ok(result.candidates.some(c => c.class_id === "PS_LOSS"));
  assert.ok(!result.audit.evidence.some(e => e.class_id === "PS_WAIT_MATERIAL"));
});

for (const text of ["Material fehlt nicht.", "Kein Hinweis: Material fehlt nicht.", "Vielleicht Material fehlt.", "Material fehlt?", "Gestern Material fehlt.", "Es ist nicht so dass Material fehlt."]) {
  test(`memo guard: ${text}`, () => {
    const input = example();
    input.memo = { status: "available", scope: "observation", text, source_ids: ["MEMO"] };
    assert.ok(!supported(input).includes("PS_WAIT_MATERIAL"));
  });
}

test("explicit negative wording inside a missing-material statement is positive evidence", () => {
  const input = example();
  input.memo = { status: "available", scope: "observation", text: "Material ist nicht verfügbar.", source_ids: ["MEMO"] };
  const result = annotate(input);
  const evidence = result.audit.evidence.find(e => e.channel === "E2_MEMO")!;
  assert.equal(evidence.class_id, "PS_WAIT_MATERIAL");
  assert.equal(input.memo.text!.slice(evidence.span!.start, evidence.span!.end), evidence.span!.text);
});

test("the AP3 v4 memo example supports missing material", () => {
  const input = example();
  input.memo = { status: "available", scope: "observation", text: "Material ist für den Auftrag noch nicht da.", source_ids: ["MEMO"] };
  assert.ok(supported(input).includes("PS_WAIT_MATERIAL"));
});

test("contradictory signs survive score combination and abstain", () => {
  const result = annotate(fixtures[3]);
  const signs = result.audit.evidence.filter(e => e.class_id === "PS_WAIT_MATERIAL").map(e => Math.sign(e.score));
  assert.ok(signs.includes(-1) && signs.includes(1));
  assert.equal(result.diagnostics.channel_conflict, true);
});

test("disjoint states are detected through ancestors", () => {
  const input = structuredClone(fixtures[1]);
  input.structured_features.operator_activity = "processing";
  input.structured_features.machine_status = "running";
  assert.equal(annotate(input).decision.status, "ABSTAIN_CONFLICTING_EVIDENCE");
});

test("a running machine alone is not proof of productive work", () => {
  const input = structuredClone(fixtures[5]);
  input.structured_features.machine_status = "running";
  input.missingness.machine_status = "present";
  assert.equal(annotate(input).decision.status, "ABSTAIN_INSUFFICIENT_EVIDENCE");
  assert.ok(!supported(input).includes("PS_PRODUCTIVE"));
});

test("invalid data are rejected rather than defaulted", () => {
  const mutations = [
    (v: Record<string, unknown>) => { v.schema_version = "1.0.0"; },
    (v: Record<string, unknown>) => { v.ontology_version = "unknown"; },
    (v: Record<string, unknown>) => { v.observed_at = "2026-11-11"; },
    (v: Record<string, unknown>) => { v.observed_at = "2026-02-30T09:00:00Z"; },
    (v: Record<string, unknown>) => { v.observed_at = "2026-11-11T24:00:00Z"; },
    (v: Record<string, unknown>) => { v.structured_features = { machine_status: "broken" }; },
    (v: Record<string, unknown>) => { v.missingness = { machine_status: "not_observed", operator_activity: "present", material_status: "not_known" }; },
    (v: Record<string, unknown>) => { v.memo = { status: "not_recorded", text: "Material fehlt.", scope: "observation", source_ids: [] }; },
    (v: Record<string, unknown>) => { v.context = { process_step_id: "" }; },
    (v: Record<string, unknown>) => { v.context = { process_step: "typo" }; },
    (v: Record<string, unknown>) => { v.observer_hint = { candidate_class_id: "INVENTED_CLASS" }; },
    (v: Record<string, unknown>) => { delete v.provenance; },
  ];
  for (const mutate of mutations) {
    const value = JSON.parse(JSON.stringify(example()));
    mutate(value);
    const result = annotate(value);
    assert.equal(result.decision.status, "INVALID_INPUT");
    assert.ok(result.diagnostics.input_errors.length > 0);
    assert.equal(result.observation_id, value.observation_id);
  }
  for (const value of [null, [], 42, "wrong"]) assert.equal(annotate(value).decision.status, "INVALID_INPUT");
});

test("observation identity is deterministic and changes with evidence", () => {
  const input = example();
  const snapshot = structuredClone(input);
  const first = annotate(input);
  assert.deepEqual(annotate(input), first);
  assert.deepEqual(input, snapshot);
  assert.equal(annotate(Object.fromEntries(Object.entries(input).reverse())).annotation_id, first.annotation_id);
  input.observation_quality.level = "high";
  assert.notEqual(annotate(input).annotation_id, first.annotation_id);
  assert.equal(first.audit.ontology_sha256, digest(ontology));
});

test("legacy adaptation keeps shared notes scoped and activity interpretation separate", () => {
  const row: LegacyObservation = { id: "OBS1", study_id: "STUDY", work_area_id: "AREA", station_id: "STATION", planned_round_id: "ROUND", observed_at: new Date("2026-11-11T09:00:00Z"), activity_type_id: "ACT", activity_label: "Warten auf Material", activity_gruppe: "VS" };
  const notes = [
    { id: "N2", planned_round_id: "ROUND", station_id: "STATION", note: "Material fehlt." },
    { id: "N1", planned_round_id: "ROUND", station_id: "STATION", note: "Information fehlt." },
    { id: "FOREIGN", planned_round_id: "OTHER", station_id: "STATION", note: "Maschine ist gestört." },
  ];
  const input = adaptLegacyObservation(row, notes);
  assert.deepEqual(input.memo.source_ids, ["N1", "N2"]);
  assert.equal(input.memo.scope, "station_round");
  assert.equal(input.observer_hint, null);
  assert.equal(input.observation_quality.level, null);
  assert.equal(input.provenance.legacy_activity!.label, row.activity_label);
  assert.ok(Object.values(input.structured_features).every(v => v === null));
  assert.equal(annotate(input).decision.status, "ABSTAIN_INSUFFICIENT_EVIDENCE");
  assert.ok(annotate(input).diagnostics.codes.includes("SHARED_MEMO_NOT_ASSIGNED"));
  assert.equal(adaptLegacyObservation({ ...row, station_id: null }, notes).memo.status, "not_recorded");
  assert.equal(adaptLegacyObservation({ ...row, planned_round_id: null }, notes).memo.status, "not_recorded");
});

function aiExample(): { input: AnnotationInput; response: AiResponse } {
  const input = structuredClone(fixtures[1]);
  const quote = "Material fehlt";
  const start = input.memo.text!.indexOf(quote);
  return { input, response: { observation_id: input.observation_id, input_sha256: digest(input), prompt_version: PROMPT_VERSION, model_id: "synthetic-replay/no-model-call", scores: [{ class_id: "PS_WAIT_MATERIAL", raw_score: 0.7, quote, start, end: start + quote.length }] } };
}

test("controlled AI retains provenance and does not double count memo rules", () => {
  const { input, response } = aiExample();
  const base = annotate(input);
  const result = annotate(input, response);
  assert.equal(result.decision.status, "ABSTAIN_UNCALIBRATED");
  assert.deepEqual(result.audit.ai_response, response);
  assert.equal(result.candidates.find(c => c.class_id === "PS_WAIT_MATERIAL")!.raw_score, base.candidates.find(c => c.class_id === "PS_WAIT_MATERIAL")!.raw_score);
  assert.notEqual(result.annotation_id, base.annotation_id);
  const request = buildAiRequest(input, base.audit.initial_candidate_ids);
  assert.equal(request.input_sha256, digest(input));
  assert.ok(request.candidates.every(c => base.audit.initial_candidate_ids.includes(c.id)));
});

test("AI hallucinations, invalid spans, stale responses and nonfinite scores fail closed", () => {
  const mutations: ((response: AiResponse) => void)[] = [
    r => { r.observation_id = "OTHER"; },
    r => { r.input_sha256 = "old snapshot"; },
    r => { r.scores[0].class_id = "HALLUCINATED"; },
    r => { r.scores[0].class_id = "PS_UNKNOWN"; },
    r => { r.scores[0].raw_score = NaN; },
    r => { r.scores[0].raw_score = Infinity; },
    r => { r.scores[0].raw_score = -1; },
    r => { r.scores[0].raw_score = 1.1; },
    r => { r.scores[0].start = -1; },
    r => { r.scores[0].end += 1; },
    r => { r.scores[0].quote = "invented quotation"; },
    r => { r.scores.push(r.scores[0]); },
  ];
  for (const mutate of mutations) {
    const { input, response } = aiExample();
    mutate(response);
    assert.equal(annotate(input, response).decision.status, "INVALID_INPUT");
  }
  const { response } = aiExample();
  const shared = structuredClone(fixtures[9]);
  response.observation_id = shared.observation_id;
  response.input_sha256 = digest(shared);
  assert.equal(annotate(shared, response).decision.status, "INVALID_INPUT");
});

test("ontology references and fallbacks fail on corruption", () => {
  assert.doesNotThrow(() => validateOntology(ontology.classes));
  const self = structuredClone(ontology.classes);
  self.find(c => c.id === "PS_WAIT_MATERIAL")!.fallback_to = "PS_WAIT_MATERIAL";
  assert.throws(() => validateOntology(self));
  const foreign = structuredClone(ontology.classes);
  foreign[1].parent = "MISSING";
  assert.throws(() => validateOntology(foreign));
  assert.throws(() => validateOntology([...ontology.classes, ontology.classes[0]]));
});

test("JSONL CLI handles good data, duplicate IDs, malformed lines and request generation", () => {
  const run = (args: string[]) => spawnSync(process.execPath, ["--import", "tsx", "scripts/annotate.ts", ...args], { encoding: "utf8" });
  const good = run([fixturePath]);
  assert.equal(good.status, 0, good.stderr);
  assert.equal(good.stdout.trim().split("\n").length, fixtures.length);
  const request = run(["--ai-request", fixturePath]);
  assert.equal(request.status, 0, request.stderr);
  assert.equal(JSON.parse(request.stdout.split("\n")[0]).prompt_version, PROMPT_VERSION);
  const dir = mkdtempSync(join(tmpdir(), "ap3-cli-"));
  try {
    const path = join(dir, "invalid.jsonl");
    writeFileSync(path, [JSON.stringify(example()), "{bad", JSON.stringify(example()), JSON.stringify({ observation_id: "INVALID" }), JSON.stringify(fixtures[1])].join("\n"));
    const bad = run([path]);
    assert.equal(bad.status, 1);
    assert.match(bad.stderr, /Line 2: invalid JSON/);
    assert.match(bad.stderr, /Line 3: duplicate observation_id/);
    const output = bad.stdout.trim().split("\n").map(s => JSON.parse(s));
    assert.equal(output[1].decision.status, "INVALID_INPUT");
    assert.equal(output[2].observation_id, fixtures[1].observation_id);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
