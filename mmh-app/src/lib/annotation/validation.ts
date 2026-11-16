import { AnnotationInput, FEATURES, FEATURE_VALUES, INPUT_SCHEMA_VERSION } from "./contracts";

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const stringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(isText);
const oneOf = (v: unknown, allowed: readonly unknown[]) => allowed.includes(v);

function isTimestamp(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const day = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  return Number.isFinite(day.valueOf()) && day.toISOString().slice(0, 10) === value.slice(0, 10) && Number(value.slice(11, 13)) < 24;
}

export function validateInput(input: unknown, ontologyVersion: string): { value: AnnotationInput; errors: [] } | { value: null; errors: string[] } {
  const errors: string[] = [];
  function object(value: unknown, path: string, keys: string[]): Record<string, unknown> {
    if (!isObject(value)) { errors.push(`${path}: object required`); return {}; }
    for (const key of Object.keys(value)) if (!keys.includes(key)) errors.push(`${path}.${key}: unknown field`);
    return value;
  }
  function check(condition: boolean, path: string) { if (!condition) errors.push(path); }
  const v = object(input, "input", ["schema_version", "ontology_version", "observation_id", "observed_at", "structured_features", "missingness", "memo", "context", "observation_quality", "observer_hint", "provenance"]);
  check(v.schema_version === INPUT_SCHEMA_VERSION, "schema_version: unsupported version");
  check(v.ontology_version === ontologyVersion, "ontology_version: unsupported version");
  check(isText(v.observation_id), "observation_id: required");
  check(isTimestamp(v.observed_at), "observed_at: valid ISO timestamp with timezone required");
  const features = object(v.structured_features, "structured_features", FEATURES);
  const missing = object(v.missingness, "missingness", FEATURES);
  for (const key of FEATURES) {
    const value = features[key];
    check(value === null || oneOf(value, FEATURE_VALUES[key]), `structured_features.${key}: invalid value`);
    check(oneOf(missing[key], ["present", "not_observed", "not_known", "not_applicable", "capture_failed"]), `missingness.${key}: invalid value`);
    const unknown = value === null || oneOf(value, ["unknown", "unclear", "not_visible"]);
    check(unknown ? missing[key] !== "present" : missing[key] === "present", `missingness.${key}: inconsistent with feature`);
    if (value === "not_visible") check(missing[key] === "not_observed", `missingness.${key}: not_visible requires not_observed`);
    if (value === "unknown" || value === "unclear") check(missing[key] === "not_known", `missingness.${key}: unknown/unclear requires not_known`);
  }
  const memo = object(v.memo, "memo", ["status", "text", "scope", "source_ids"]);
  check(oneOf(memo.status, ["available", "not_recorded", "capture_failed"]), "memo.status: invalid value");
  check(memo.status === "available" ? isText(memo.text) : memo.text === null, "memo.text: inconsistent with status");
  check(oneOf(memo.scope, ["observation", "station_round"]), "memo.scope: invalid value");
  check(stringArray(memo.source_ids) && (memo.status !== "available" || memo.source_ids.length > 0), "memo.source_ids: source references required for available memo");
  const context = object(v.context, "context", ["area_id", "workcenter_id", "process_step_id"]);
  for (const [key, value] of Object.entries(context)) check(isText(value), `context.${key}: nonempty reference required`);
  const quality = object(v.observation_quality, "observation_quality", ["level"]);
  check(oneOf(quality.level, ["high", "medium", "low", "not_observable", null]), "observation_quality.level: invalid value");
  if (v.observer_hint !== null) {
    const hint = object(v.observer_hint, "observer_hint", ["candidate_class_id"]);
    check(isText(hint.candidate_class_id), "observer_hint.candidate_class_id: required");
  }
  const provenance = object(v.provenance, "provenance", ["source", "source_schema", "adapter_version", "study_id", "limitations", "legacy_activity"]);
  check(oneOf(provenance.source, ["ap2_draft", "legacy_mmh", "synthetic"]), "provenance.source: invalid value");
  check(isText(provenance.source_schema), "provenance.source_schema: required");
  check(provenance.adapter_version === null || isText(provenance.adapter_version), "provenance.adapter_version: invalid value");
  check(isText(provenance.study_id), "provenance.study_id: required");
  check(stringArray(provenance.limitations), "provenance.limitations: string array required");
  if (provenance.legacy_activity !== undefined) {
    const activity = object(provenance.legacy_activity, "provenance.legacy_activity", ["id", "label", "gruppe"]);
    check(isText(activity.id) && isText(activity.label) && oneOf(activity.gruppe, ["HT", "NT", "VS", "FK"]), "provenance.legacy_activity: invalid activity");
  }
  return errors.length ? { value: null, errors } : { value: structuredClone(input) as AnnotationInput, errors: [] };
}
