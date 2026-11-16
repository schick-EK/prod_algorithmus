import {
  AnnotationResult,
  DecisionStatus,
  PIPELINE_VERSION,
  RESULT_SCHEMA_VERSION,
} from "./contracts";
import { ancestors, classesById, ontology } from "./ontology";
import { digest } from "./hash";

export interface ReferenceAnnotation {
  schema_version: "ap3-reference/0.1.0";
  observation_id: string;
  source: "synthetic" | "human_reviewed";
  group_id: string;
  split: "development" | "test";
  reference:
    | { kind: "class_set"; class_ids: string[]; accept_descendants: boolean }
    | { kind: "expected_abstain"; allowed_statuses: DecisionStatus[] }
    | { kind: "out_of_scope" };
}

const STATUSES: DecisionStatus[] = [
  "ABSTAIN_INSUFFICIENT_EVIDENCE",
  "ABSTAIN_CONFLICTING_EVIDENCE",
  "ABSTAIN_MISSING_REQUIRED_CONTEXT",
  "ABSTAIN_UNCALIBRATED",
];
const text = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;
function object(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function keys(v: Record<string, unknown>, allowed: string[]) {
  return Object.keys(v).every((k) => allowed.includes(k));
}

export function validateReferences(values: unknown[]): ReferenceAnnotation[] {
  const ids = new Set<string>();
  const groups = new Map<string, string>();
  for (const [index, value] of values.entries()) {
    const fail = (): never => {
      throw new Error(
        `Reference ${index + 1}: invalid, duplicated, unsupported, or group split leakage`,
      );
    };
    if (
      !object(value) ||
      !keys(value, [
        "schema_version",
        "observation_id",
        "source",
        "group_id",
        "split",
        "reference",
      ])
    )
      fail();
    const v = value as Record<string, unknown>;
    if (
      v.schema_version !== "ap3-reference/0.1.0" ||
      !text(v.observation_id) ||
      !text(v.group_id) ||
      typeof v.source !== "string" ||
      !["synthetic", "human_reviewed"].includes(v.source) ||
      typeof v.split !== "string" ||
      !["development", "test"].includes(v.split) ||
      !object(v.reference)
    )
      fail();
    const id = v.observation_id as string;
    const group = v.group_id as string;
    if (ids.has(id) || (groups.has(group) && groups.get(group) !== v.split))
      fail();
    ids.add(id);
    groups.set(group, v.split as string);
    const ref = v.reference as Record<string, unknown>;
    if (ref.kind === "class_set") {
      if (
        !keys(ref, ["kind", "class_ids", "accept_descendants"]) ||
        !Array.isArray(ref.class_ids) ||
        !ref.class_ids.length ||
        !ref.class_ids.every(
          (id) => typeof id === "string" && classesById.has(id),
        ) ||
        new Set(ref.class_ids).size !== ref.class_ids.length ||
        typeof ref.accept_descendants !== "boolean"
      )
        fail();
    } else if (ref.kind === "expected_abstain") {
      if (
        !keys(ref, ["kind", "allowed_statuses"]) ||
        !Array.isArray(ref.allowed_statuses) ||
        !ref.allowed_statuses.length ||
        !ref.allowed_statuses.every((status) =>
          STATUSES.includes(status as DecisionStatus),
        )
      )
        fail();
    } else if (ref.kind !== "out_of_scope" || !keys(ref, ["kind"])) fail();
  }
  return structuredClone(values) as ReferenceAnnotation[];
}

export function evaluateAnnotations(
  results: AnnotationResult[],
  referenceValues: unknown[],
) {
  const references = validateReferences(referenceValues);
  const byId = new Map<string, AnnotationResult>();
  for (const result of results) {
    if (
      !result.observation_id ||
      byId.has(result.observation_id) ||
      result.decision.status === "INVALID_INPUT" ||
      result.schema_version !== RESULT_SCHEMA_VERSION ||
      result.versions.pipeline !== PIPELINE_VERSION ||
      result.versions.ontology !== ontology.version
    )
      throw new Error(
        "Evaluation requires unique valid annotation results with matching versions",
      );
    byId.set(result.observation_id, result);
  }
  if (
    references.length !== results.length ||
    references.some((ref) => !byId.has(ref.observation_id))
  )
    throw new Error(
      "Every annotation must have exactly one reference; unmatched observations/references found",
    );
  const memoSplits = new Map<string, string>();
  for (const ref of references) {
    if (
      ref.source === "human_reviewed" &&
      byId.get(ref.observation_id)!.audit.input?.provenance.source ===
        "synthetic"
    )
      throw new Error(
        "Synthetic observations cannot be reported as empirical human-reviewed data",
      );
    const input = byId.get(ref.observation_id)!.audit.input;
    for (const sourceId of input?.memo.source_ids ?? []) {
      const key = JSON.stringify([input!.provenance.study_id, sourceId]);
      if (memoSplits.has(key) && memoSplits.get(key) !== ref.split)
        throw new Error("Shared memo evidence crosses development/test splits");
      memoSplits.set(key, ref.split);
    }
  }
  const ordered = [...references].sort((a, b) =>
    a.observation_id < b.observation_id
      ? -1
      : a.observation_id > b.observation_id
        ? 1
        : 0,
  );
  const cases = ordered.map((ref) => {
    const result = byId.get(ref.observation_id)!;
    const ranked = [...result.candidates]
      .filter((c) => c.raw_score > 0 && c.class_id !== "PS_UNKNOWN")
      .sort(
        (a, b) =>
          b.raw_score - a.raw_score ||
          a.class_id.localeCompare(b.class_id, "en"),
      );
    const definition = ref.reference;
    const matches = (id: string) =>
      definition.kind === "class_set" &&
      definition.class_ids.some(
        (target) =>
          id === target ||
          (definition.accept_descendants && ancestors(id).includes(target)),
      );
    return {
      observation_id: ref.observation_id,
      source: ref.source,
      split: ref.split,
      group_id: ref.group_id,
      reference: definition,
      annotation_id: result.annotation_id,
      decision_status: result.decision.status,
      candidate_hit:
        definition.kind === "class_set"
          ? result.candidates.some((c) => matches(c.class_id))
          : null,
      raw_top1_hit:
        definition.kind === "class_set"
          ? ranked.slice(0, 1).some((c) => matches(c.class_id))
          : null,
      raw_top3_hit:
        definition.kind === "class_set"
          ? ranked.slice(0, 3).some((c) => matches(c.class_id))
          : null,
      abstain_match:
        definition.kind === "expected_abstain"
          ? definition.allowed_statuses.includes(result.decision.status)
          : null,
      out_of_scope_match: null,
    };
  });
  const rate = (values: (boolean | null)[]) => {
    const measured = values.filter((v): v is boolean => v !== null);
    return measured.length
      ? measured.filter(Boolean).length / measured.length
      : null;
  };
  function summarize(selected: typeof cases) {
    const statuses: Record<string, number> = {};
    for (const c of selected)
      statuses[c.decision_status] = (statuses[c.decision_status] ?? 0) + 1;
    return {
      observations: selected.length,
      class_reference_cases: selected.filter(
        (c) => c.reference.kind === "class_set",
      ).length,
      abstain_reference_cases: selected.filter(
        (c) => c.reference.kind === "expected_abstain",
      ).length,
      out_of_scope_reference_cases: selected.filter(
        (c) => c.reference.kind === "out_of_scope",
      ).length,
      candidate_hit_rate: rate(selected.map((c) => c.candidate_hit)),
      raw_score_top1_hit_rate: rate(selected.map((c) => c.raw_top1_hit)),
      raw_score_top3_hit_rate: rate(selected.map((c) => c.raw_top3_hit)),
      expected_abstain_match_rate: rate(selected.map((c) => c.abstain_match)),
      coverage: selected.length
        ? selected.filter((c) => !byId.get(c.observation_id)!.decision.abstain)
            .length / selected.length
        : null,
      error_on_accepted: null,
      out_of_scope_match_rate: null,
      decision_status_counts: statuses,
    };
  }
  const fingerprints = {
    inputs: digest(
      ordered.map((ref) => byId.get(ref.observation_id)!.audit.input_sha256),
    ),
    references: digest(ordered),
    annotations: digest(cases.map((c) => c.annotation_id)),
  };
  return {
    schema_version: "ap3-evaluation/0.1.0",
    report_id: `EVAL_${digest({ schema_version: "ap3-evaluation/0.1.0", fingerprints }).slice(0, 32)}`,
    versions: { pipeline: PIPELINE_VERSION, ontology: ontology.version },
    fingerprints,
    by_reference_source: Object.fromEntries(
      ["synthetic", "human_reviewed"].map((source) => {
        const selected = cases.filter((c) => c.source === source);
        return [
          source,
          {
            ...summarize(selected),
            by_split: Object.fromEntries(
              ["development", "test"].map((split) => [
                split,
                summarize(selected.filter((c) => c.split === split)),
              ]),
            ),
          },
        ];
      }),
    ),
    calibration_metrics: {
      brier_score: null,
      log_loss: null,
      ece: null,
      reason:
        "No calibrated distributions; raw score rankings are diagnostic baselines only.",
    },
    cases,
  };
}
