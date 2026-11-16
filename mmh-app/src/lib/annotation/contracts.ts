/** Experimental AP2/AP3 contract, deliberately distinct from the proposed v1.0. */
export const INPUT_SCHEMA_VERSION = "ap3-input/0.1.0";
export const PIPELINE_VERSION = "0.1.0";
export const RULESET_VERSION = "0.1.0";

export const FEATURE_VALUES = {
  machine_status: ["running", "stopped", "changing_state", "not_visible", "unknown"],
  operator_activity: ["processing", "waiting", "moving", "transporting", "searching", "inspecting", "working_on_equipment", "communicating", "not_visible", "unclear"],
  material_status: ["available", "not_available", "not_visible", "unknown"],
} as const;
export type Feature = keyof typeof FEATURE_VALUES;
export const FEATURES = Object.keys(FEATURE_VALUES) as Feature[];
export type Missingness = "present" | "not_observed" | "not_known" | "not_applicable" | "capture_failed";

export interface AnnotationInput {
  schema_version: typeof INPUT_SCHEMA_VERSION;
  ontology_version: string;
  observation_id: string;
  observed_at: string;
  structured_features: { [K in Feature]: (typeof FEATURE_VALUES)[K][number] | null };
  missingness: Record<Feature, Missingness>;
  memo: {
    status: "available" | "not_recorded" | "capture_failed";
    text: string | null;
    scope: "observation" | "station_round";
    source_ids: string[];
  };
  context: { area_id?: string; workcenter_id?: string; process_step_id?: string };
  observation_quality: { level: "high" | "medium" | "low" | "not_observable" | null };
  observer_hint: { candidate_class_id: string } | null;
  provenance: {
    source: "ap2_draft" | "legacy_mmh" | "synthetic";
    source_schema: string;
    adapter_version: string | null;
    study_id: string;
    limitations: string[];
    legacy_activity?: { id: string; label: string; gruppe: "HT" | "NT" | "VS" | "FK" };
  };
}

export interface EvidenceContribution {
  class_id: string;
  channel: "E1_STRUCTURED" | "E2_MEMO" | "E4_OBSERVER_HINT" | "AI_MEMO";
  rule_id: string;
  score: number; // Signed, uncalibrated support; never a probability.
  source: string;
  span?: { start: number; end: number; text: string };
}

export type DecisionStatus =
  | "INVALID_INPUT"
  | "ABSTAIN_INSUFFICIENT_EVIDENCE"
  | "ABSTAIN_CONFLICTING_EVIDENCE"
  | "ABSTAIN_MISSING_REQUIRED_CONTEXT"
  | "ABSTAIN_UNCALIBRATED";

export interface AnnotationResult {
  annotation_id: string;
  observation_id: string | null;
  candidate_distribution: null;
  resolved: null;
  decision: { status: DecisionStatus; abstain: true };
  candidates: { class_id: string; raw_score: number; granularity: string; missing_required_context: string[] }[];
  diagnostics: { codes: string[]; channel_conflict: boolean; out_of_scope: null; input_errors: string[] };
  versions: { observation_schema: string; ontology: string; ruleset: string; pipeline: string; calibration: "none"; ai_component: string };
  audit: {
    input: AnnotationInput | null;
    ontology_sha256: string;
    candidate_scope: "experimental_ap1_subset";
    initial_candidate_ids: string[];
    evidence: EvidenceContribution[];
    constraints: string[];
    ai_response: unknown | null;
  };
}
