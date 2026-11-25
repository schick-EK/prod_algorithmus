import {
  AnnotationInput,
  ChannelConflict,
  EvidenceContribution,
  EvidenceMode,
} from "./contracts";

interface MemoRule {
  id: string;
  class_id: string;
  pattern: RegExp;
  score?: number;
}
const MEMO_RULES: MemoRule[] = [
  {
    id: "MEMO_MATERIAL_MISSING",
    class_id: "PS_WAIT_MATERIAL",
    pattern:
      /\b(?:material|bauteil|bauteile)\s+(?:fehlt|fehlen|(?:ist|sind)\s+(?:für\s+den\s+auftrag\s+)?(?:noch\s+)?nicht\s+(?:da|verfügbar))\b/gi,
  },
  {
    id: "MEMO_INFORMATION_MISSING",
    class_id: "PS_WAIT_INFORMATION",
    pattern: /\b(?:information|zeichnung|entscheidung)\s+fehlt\b/gi,
  },
  {
    id: "MEMO_QUALITY_RELEASE",
    class_id: "PS_WAIT_QUALITY_RELEASE",
    pattern: /\b(?:qualitätsfreigabe|prüffreigabe)\s+fehlt\b/gi,
  },
  {
    id: "MEMO_MACHINE_DISTURBANCE",
    class_id: "PS_DISTURB_MACHINE",
    pattern:
      /\b(?:maschine|anlage)\s+(?:steht\s+wegen\s+(?:einer\s+)?störung|ist\s+gestört)\b/gi,
  },
  {
    id: "MEMO_SEARCH_MATERIAL",
    class_id: "PS_SEARCH_MATERIAL",
    pattern: /\b(?:sucht\s+(?:nach\s+)?material|material\s+wird\s+gesucht)\b/gi,
  },
  {
    id: "MEMO_SEARCH_TOOL",
    class_id: "PS_SEARCH_TOOL",
    pattern: /\b(?:sucht\s+(?:nach\s+)?werkzeug|werkzeug\s+wird\s+gesucht)\b/gi,
  },
  {
    id: "MEMO_REWORK",
    class_id: "PS_REWORK",
    pattern:
      /\b(?:nacharbeit\s+wegen\s+(?:eines\s+)?fehlers|fehlerhaftes\s+teil\s+wird\s+nachgearbeitet)\b/gi,
  },
  {
    id: "MEMO_MATERIAL_AVAILABLE",
    class_id: "PS_WAIT_MATERIAL",
    score: -0.7,
    pattern:
      /\b(?:material|bauteile?)\s+(?:ist|sind)\s+(?:vorhanden|verfügbar|da)\b/gi,
  },
  {
    id: "MEMO_WAIT_MACHINE",
    class_id: "PS_WAIT_MACHINE",
    pattern: /\bwartet\s+auf\s+(?:die\s+)?maschine\b/gi,
  },
  {
    id: "MEMO_WAIT_PERSONNEL",
    class_id: "PS_WAIT_PERSONNEL",
    pattern: /\b(?:personal\s+fehlt|wartet\s+auf\s+(?:den\s+)?einrichter)\b/gi,
  },
  {
    id: "MEMO_WAIT_PREVIOUS",
    class_id: "PS_WAIT_PREVIOUS_PROCESS",
    pattern: /\bvorprozess\s+ist\s+noch\s+nicht\s+abgeschlossen\b/gi,
  },
  {
    id: "MEMO_PLANNED_SETUP",
    class_id: "PS_SETUP",
    pattern: /\b(?:geplanter\s+werkzeugwechsel|geplantes\s+rüsten)\b/gi,
  },
  {
    id: "MEMO_PLANNED_INSPECTION",
    class_id: "PS_INSPECTION",
    pattern: /\bgeplante\s+(?:produkt|bauteil)prüfung\b/gi,
  },
];

/** Intentionally narrow German phrase baseline, not a general language model. */
function matches(
  text: string,
  pattern: RegExp,
): { start: number; end: number; text: string }[] {
  const spans: { start: number; end: number; text: string }[] = [];
  // Clause-level negation/hedging guard. Preserve offsets into the original memo.
  for (const clause of text.matchAll(/[^.!?;,\n]+/g)) {
    for (const match of clause[0].matchAll(
      new RegExp(pattern.source, pattern.flags),
    )) {
      const rest =
        clause[0].slice(0, match.index) +
        " " +
        clause[0].slice(match.index! + match[0].length);
      if (
        /\b(?:nicht|kein\w*|ohne|nie|niemals|weder|vielleicht|eventuell|vermutlich|möglicherweise|unklar|ob|gestern|früher|vorhin|damals|zuvor|morgen|später|wenn|falls|würde|wäre|könnte|angenommen)\b/i.test(
          rest,
        )
      )
        continue;
      if (text[clause.index! + clause[0].length] === "?") continue;
      const start = clause.index! + match.index!;
      spans.push({ start, end: start + match[0].length, text: match[0] });
    }
  }
  return spans;
}

export function evaluateRules(
  input: AnnotationInput,
  mode: EvidenceMode = "combined",
): {
  evidence: EvidenceContribution[];
  explicitConflict: boolean;
  conflicts: ChannelConflict[];
} {
  const evidence: EvidenceContribution[] = [];
  const conflicts: ChannelConflict[] = [];
  const features = input.structured_features;
  function feature(
    class_id: string,
    rule_id: string,
    score: number,
    source: string,
  ) {
    evidence.push({
      class_id,
      rule_id,
      score,
      source,
      channel: "E1_STRUCTURED",
    });
  }
  if (mode !== "memo_only") {
    switch (features.operator_activity) {
      case "waiting":
        feature(
          "PS_WAITING",
          "FEATURE_WAITING",
          0.8,
          "structured_features.operator_activity",
        );
        break;
      case "processing":
        feature(
          "PS_PRODUCTIVE",
          "FEATURE_PROCESSING",
          0.6,
          "structured_features.operator_activity",
        );
        break;
      case "inspecting":
        feature(
          "PS_INSPECTION",
          "FEATURE_INSPECTING",
          0.6,
          "structured_features.operator_activity",
        );
        break;
      case "searching":
        feature(
          "PS_SEARCHING",
          "FEATURE_SEARCHING",
          0.8,
          "structured_features.operator_activity",
        );
        break;
    }
    if (features.machine_status === "stopped") {
      feature(
        "PS_WAITING",
        "FEATURE_STOPPED_WAITING",
        0.2,
        "structured_features.machine_status",
      );
      feature(
        "PS_DISTURBANCE",
        "FEATURE_STOPPED_DISTURBANCE",
        0.2,
        "structured_features.machine_status",
      );
    }
    if (
      features.material_status === "not_available" &&
      features.operator_activity === "waiting"
    ) {
      feature(
        "PS_WAIT_MATERIAL",
        "FEATURE_WAITING_MATERIAL_MISSING",
        0.6,
        "structured_features.material_status",
      );
    }
    if (features.material_status === "available") {
      feature(
        "PS_WAIT_MATERIAL",
        "FEATURE_MATERIAL_AVAILABLE",
        -0.6,
        "structured_features.material_status",
      );
    }
  }
  // A station-round note cannot safely describe each counted observation.
  if (
    mode === "observation_only" ||
    input.memo.status !== "available" ||
    input.memo.scope !== "observation"
  )
    return { evidence, explicitConflict: false, conflicts };
  for (const rule of MEMO_RULES) {
    const span = matches(input.memo.text!, rule.pattern)[0];
    if (span)
      evidence.push({
        class_id: rule.class_id,
        channel: "E2_MEMO",
        rule_id: rule.id,
        score: rule.score ?? 0.7,
        source: "memo.text",
        span,
      });
  }
  if (mode === "combined") {
    const facts = [
      {
        value: "stopped",
        opposite: "running",
        pattern: /\b(?:maschine|anlage)\s+(?:steht|ist\s+gestoppt)\b/gi,
      },
      {
        value: "running",
        opposite: "stopped",
        pattern: /\b(?:maschine|anlage)\s+läuft\b/gi,
      },
    ];
    for (const fact of facts) {
      const span = matches(input.memo.text!, fact.pattern)[0];
      if (span && features.machine_status === fact.opposite)
        conflicts.push({
          feature: "machine_status",
          observed_value: fact.opposite,
          memo_value: fact.value,
          span,
        });
    }
  }
  return { evidence, explicitConflict: conflicts.length > 0, conflicts };
}
