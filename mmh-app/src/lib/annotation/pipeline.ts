import {
  AnnotationResult,
  DecisionStatus,
  EvidenceContribution,
  INPUT_SCHEMA_VERSION,
  PIPELINE_VERSION,
  RESULT_SCHEMA_VERSION,
  RULESET_VERSION,
} from "./contracts";
import { validateAiResponse, PROMPT_VERSION } from "./controlled-ai";
import { digest } from "./hash";
import {
  ancestors,
  classesById,
  generateCandidates,
  ontology,
} from "./ontology";
import { evaluateRules } from "./rules";
import { validateInput } from "./validation";

function hasConflict(evidence: EvidenceContribution[]): boolean {
  const positive = evidence.filter((e) => e.score > 0);
  if (
    positive.some((a) =>
      evidence.some((b) => b.class_id === a.class_id && b.score < 0),
    )
  )
    return true;
  return positive.some((a) =>
    positive.some((b) => {
      const left = [a.class_id, ...ancestors(a.class_id)];
      const right = [b.class_id, ...ancestors(b.class_id)];
      return left.some((id) =>
        classesById
          .get(id)!
          .disjoint_with.some((other) => right.includes(other)),
      );
    }),
  );
}

function rawScore(evidence: EvidenceContribution[]): number {
  // Rules and AI interpreting the same memo are dependent sources, not two votes.
  const groups = ["E1_STRUCTURED", "MEMO", "E4_OBSERVER_HINT"];
  return Number(
    groups
      .reduce((sum, group) => {
        const values = evidence
          .filter(
            (e) =>
              (e.channel === "E2_MEMO" || e.channel === "AI_MEMO"
                ? "MEMO"
                : e.channel) === group,
          )
          .map((e) => e.score);
        return sum + Math.max(0, ...values) + Math.min(0, ...values);
      }, 0)
      .toFixed(6),
  );
}

export function annotate(
  input: unknown,
  aiResponse?: unknown,
): AnnotationResult {
  const parsed = validateInput(input, ontology.version);
  const errors = [...parsed.errors];
  const v = parsed.value;
  const codes = new Set<string>([
    "PARTIAL_ONTOLOGY",
    "CALIBRATION_UNCERTAINTY",
  ]);
  const ruleResult = v
    ? evaluateRules(v)
    : { evidence: [], explicitConflict: false };
  const evidence = ruleResult.evidence;
  if (v?.observer_hint) {
    if (classesById.has(v.observer_hint.candidate_class_id)) {
      evidence.push({
        class_id: v.observer_hint.candidate_class_id,
        channel: "E4_OBSERVER_HINT",
        rule_id: "OBSERVER_HINT_WEAK",
        score: 0.2,
        source: "observer_hint.candidate_class_id",
      });
    } else
      errors.push(
        "observer_hint.candidate_class_id: outside experimental ontology subset",
      );
  }
  // Counterevidence must not select a family: absent material is a different
  // statement from evidence against material shortage. Keep the full subset
  // when no class receives positive support (CON-008/CON-019).
  const ids = v
    ? generateCandidates(
        evidence.filter((e) => e.score > 0).map((e) => e.class_id),
      )
    : [];
  // Keep every negative target visible even when positive evidence selected
  // another family, so its score and constraints remain inspectable.
  for (const e of evidence) {
    if (!ids.includes(e.class_id)) {
      for (const id of generateCandidates([e.class_id]))
        if (!ids.includes(id)) ids.push(id);
    }
  }
  ids.sort();
  let aiComponent = "disabled";
  let aiValid: boolean | null = null;
  const attemptedAi =
    aiResponse === undefined ? null : structuredClone(aiResponse);
  if (v && aiResponse !== undefined) {
    try {
      const ai = validateAiResponse(aiResponse, v, ids);
      evidence.push(...ai.evidence);
      aiValid = true;
      aiComponent = `${PROMPT_VERSION}:${ai.response.model_id}`;
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "Invalid AI response",
      );
      codes.add("AI_RESPONSE_INVALID");
      aiValid = false;
    }
  }
  const candidates = ids.map((class_id) => {
    const c = classesById.get(class_id)!;
    return {
      class_id,
      raw_score: rawScore(evidence.filter((e) => e.class_id === class_id)),
      granularity: c.granularity,
      missing_required_context: c.required_context.filter(
        (key) => !v?.context[key as keyof typeof v.context],
      ),
    };
  });
  const conflict = ruleResult.explicitConflict || hasConflict(evidence);
  if (conflict) codes.add("CHANNEL_CONFLICT");
  if (v?.memo.scope === "station_round" && v.memo.status === "available")
    codes.add("SHARED_MEMO_NOT_ASSIGNED");
  if (v && Object.values(v.missingness).some((m) => m !== "present"))
    codes.add("INPUT_MISSING");
  if (v?.observation_quality.level === null) codes.add("INPUT_QUALITY_UNKNOWN");
  if (
    v?.observation_quality.level === "low" ||
    v?.observation_quality.level === "not_observable"
  )
    codes.add("INPUT_LOW_QUALITY");
  const missingContext = candidates.some(
    (c) => c.raw_score > 0 && c.missing_required_context.length,
  );
  if (missingContext) codes.add("MISSING_REQUIRED_CONTEXT");
  const hasEvidence = evidence.some(
    (e) =>
      e.score > 0 &&
      e.channel !== "E4_OBSERVER_HINT" &&
      e.class_id !== "PS_UNKNOWN",
  );
  let status: DecisionStatus = "ABSTAIN_UNCALIBRATED";
  if (!hasEvidence || codes.has("INPUT_LOW_QUALITY"))
    status = "ABSTAIN_INSUFFICIENT_EVIDENCE";
  else if (conflict) status = "ABSTAIN_CONFLICTING_EVIDENCE";
  else if (missingContext) status = "ABSTAIN_MISSING_REQUIRED_CONTEXT";
  if (errors.length) status = "INVALID_INPUT";
  if (!v && aiResponse !== undefined) aiValid = false;
  const versions = {
    observation_schema: INPUT_SCHEMA_VERSION,
    ontology: ontology.version,
    ruleset: RULESET_VERSION,
    pipeline: PIPELINE_VERSION,
    calibration: "none" as const,
    ai_component: aiComponent,
  };
  const ontologyHash = digest(ontology);
  const inputHash = digest(input ?? null);
  return {
    schema_version: RESULT_SCHEMA_VERSION,
    annotation_id: `ANN_${digest({ inputHash, errors, versions, ontologyHash, aiResponse: attemptedAi }).slice(0, 32)}`,
    observation_id:
      v?.observation_id ??
      (input &&
      typeof input === "object" &&
      "observation_id" in input &&
      typeof input.observation_id === "string"
        ? input.observation_id
        : null),
    candidate_distribution: null,
    resolved: null,
    decision: { status, abstain: true },
    candidates,
    diagnostics: {
      codes: [...codes].sort(),
      channel_conflict: conflict,
      out_of_scope: null,
      input_errors: errors,
    },
    versions,
    audit: {
      input: v,
      input_sha256: inputHash,
      ontology_sha256: ontologyHash,
      candidate_scope: "experimental_ap1_subset",
      initial_candidate_ids: ids,
      evidence,
      constraints: [
        "CON-001",
        "CON-002",
        "CON-006",
        "CON-007",
        "CON-008",
        "CON-009",
        "CON-010",
        "CON-011",
        "CON-012",
        "CON-019",
      ],
      ai_response: attemptedAi,
      ai_response_valid: aiValid,
    },
  };
}
