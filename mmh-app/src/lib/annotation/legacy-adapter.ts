import { AnnotationInput, INPUT_SCHEMA_VERSION } from "./contracts";
import { ontology } from "./ontology";

export interface LegacyObservation {
  id: string;
  study_id: string;
  work_area_id: string;
  station_id: string | null;
  planned_round_id: string | null;
  observed_at: Date;
  activity_type_id: string;
  activity_label: string;
  activity_gruppe: "HT" | "NT" | "VS" | "FK";
}
export interface LegacyNote { id: string; planned_round_id: string; station_id: string; note: string | null }

/** Bridge existing storage without inventing missing AP2 features or memo linkage. */
export function adaptLegacyObservation(row: LegacyObservation, notes: LegacyNote[]): AnnotationInput {
  const matching = notes.filter(n => row.planned_round_id !== null && row.station_id !== null && n.planned_round_id === row.planned_round_id && n.station_id === row.station_id && n.note?.trim()).sort((a, b) => a.id.localeCompare(b.id, "en"));
  return {
    schema_version: INPUT_SCHEMA_VERSION,
    ontology_version: ontology.version,
    observation_id: row.id,
    observed_at: row.observed_at.toISOString(),
    structured_features: { machine_status: null, operator_activity: null, material_status: null },
    missingness: { machine_status: "not_observed", operator_activity: "not_observed", material_status: "not_observed" },
    memo: { status: matching.length ? "available" : "not_recorded", text: matching.length ? matching.map(n => n.note).join("\n") : null, scope: "station_round", source_ids: matching.map(n => n.id) },
    context: { area_id: row.work_area_id, ...(row.station_id ? { workcenter_id: row.station_id } : {}) },
    observation_quality: { level: null },
    observer_hint: null,
    provenance: {
      source: "legacy_mmh",
      source_schema: "mmh-app/0.1.0",
      adapter_version: "legacy-mmh/0.1.0",
      study_id: row.study_id,
      limitations: ["Structured observation features were not captured.", "Observation quality was not captured.", "Activity labels and HT/NT/VS/FK groups are preserved as legacy data, not mapped to ontology labels.", "Notes refer to a station and round, not an individual counted observation."],
      legacy_activity: { id: row.activity_type_id, label: row.activity_label, gruppe: row.activity_gruppe },
    },
  };
}
