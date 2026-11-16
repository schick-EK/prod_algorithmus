import { and, desc, eq } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../../db/schema";
import { AnnotationInput, FEATURES } from "./contracts";
import { adaptLegacyObservation } from "./legacy-adapter";
import { ontology } from "./ontology";
import { validateInput } from "./validation";

type ApplicationDb = BetterSQLite3Database<typeof schema>;
type Reader = Pick<ApplicationDb, "select">;
const { observations, activityTypes, roundNotes, observationEvidence } = schema;

export function observationSource(database: Reader, id: string) {
  return database
    .select({
      id: observations.id,
      study_id: observations.study_id,
      work_area_id: observations.work_area_id,
      station_id: observations.station_id,
      planned_round_id: observations.planned_round_id,
      observed_at: observations.observed_at,
      activity_type_id: observations.activity_type_id,
      activity_label: activityTypes.label,
      activity_gruppe: activityTypes.gruppe,
    })
    .from(observations)
    .innerJoin(
      activityTypes,
      eq(observations.activity_type_id, activityTypes.id),
    )
    .where(eq(observations.id, id))
    .get();
}

export function loadObservationEvidence(database: ApplicationDb, id: string) {
  return database.transaction((tx) => {
    const source = observationSource(tx, id);
    if (!source) return null;
    const notes =
      source.station_id && source.planned_round_id
        ? tx
            .select({
              id: roundNotes.id,
              planned_round_id: roundNotes.planned_round_id,
              station_id: roundNotes.station_id,
              note: roundNotes.note,
            })
            .from(roundNotes)
            .where(
              and(
                eq(roundNotes.station_id, source.station_id),
                eq(roundNotes.planned_round_id, source.planned_round_id),
              ),
            )
            .all()
        : [];
    const history = tx
      .select()
      .from(observationEvidence)
      .where(eq(observationEvidence.observation_id, id))
      .orderBy(desc(observationEvidence.revision))
      .all();
    const legacy = adaptLegacyObservation(source, notes);
    const input = history[0]?.input ?? legacy;
    const validated = validateInput(input, ontology.version);
    if (!validated.value)
      throw new Error(
        `Gespeicherte Evidenz ist ungültig: ${validated.errors.join("; ")}`,
      );
    return {
      source,
      input: validated.value,
      legacy,
      revision: history[0]?.revision ?? 0,
      history: history.map((row) => ({
        revision: row.revision,
        created_at: row.created_at,
      })),
    };
  });
}

/** Turn deliberately entered fields into an input; legacy class labels are never
 * used to prefill observation features or an individual memo. */
export function manualEvidenceInput(
  base: AnnotationInput,
  form: FormData,
  nextRevision: number,
): AnnotationInput {
  const field = (key: string) => {
    const value = form.get(key);
    if (typeof value !== "string") throw new Error(`Feld fehlt: ${key}`);
    return value;
  };
  const features: Record<string, unknown> = {};
  const missingness: Record<string, unknown> = {};
  for (const feature of FEATURES) {
    const value = field(feature);
    features[feature] = value || null;
    missingness[feature] =
      value === "not_visible"
        ? "not_observed"
        : ["unknown", "unclear"].includes(value)
          ? "not_known"
          : value
            ? "present"
            : field(`missingness_${feature}`);
  }
  const status = field("memo_status");
  const memoText = field("memo_text");
  if (memoText.length > 10000)
    throw new Error("Das Memo darf höchstens 10000 Zeichen enthalten.");
  if (status !== "available" && memoText.trim())
    throw new Error(
      "Für einen eingegebenen Memotext bitte den Status „Vorhanden“ wählen.",
    );
  const processStep = field("process_step_id").trim();
  const input = {
    ...base,
    structured_features: features,
    missingness,
    memo: {
      status,
      text: status === "available" ? memoText : null,
      scope: "observation",
      source_ids:
        status === "available"
          ? [`EVIDENCE_${base.observation_id}_r${nextRevision}`]
          : [],
    },
    context: { ...base.context },
    observation_quality: { level: field("quality") || null },
    observer_hint: null,
    provenance: {
      ...base.provenance,
      source: "ap2_draft",
      source_schema: "individual-evidence/0.1.0",
      adapter_version: "manual-evidence/0.1.0",
      limitations: [
        "Individuell nacherfasste Evidenz; der ursprüngliche Beobachtungszeitpunkt bleibt erhalten.",
        "Gemeinsame Stationsnotizen verbleiben getrennt in round_notes.",
      ],
    },
  };
  delete input.context.process_step_id;
  if (processStep)
    Object.assign(input.context, { process_step_id: processStep });
  const parsed = validateInput(input, ontology.version);
  if (!parsed.value) throw new Error(parsed.errors.join("; "));
  return parsed.value;
}

export function saveEvidenceRevision(
  database: ApplicationDb,
  input: AnnotationInput,
  expectedRevision: number,
) {
  if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0)
    throw new Error("Ungültige Revisionsnummer.");
  const validated = validateInput(input, ontology.version);
  if (!validated.value) throw new Error(validated.errors.join("; "));
  return database.transaction((tx) => {
    const source = observationSource(tx, input.observation_id);
    if (
      !source ||
      source.study_id !== input.provenance.study_id ||
      source.work_area_id !== input.context.area_id ||
      (source.station_id ?? undefined) !== input.context.workcenter_id ||
      source.observed_at.toISOString() !== input.observed_at
    )
      throw new Error(
        "Evidenz und ursprüngliche Beobachtung passen nicht zusammen.",
      );
    const latest = tx
      .select({ revision: observationEvidence.revision })
      .from(observationEvidence)
      .where(eq(observationEvidence.observation_id, input.observation_id))
      .orderBy(desc(observationEvidence.revision))
      .get();
    if ((latest?.revision ?? 0) !== expectedRevision)
      throw new Error(
        "Die Beobachtung wurde inzwischen geändert. Bitte die Seite neu laden und die neue Revision prüfen.",
      );
    const revision = expectedRevision + 1;
    if (
      input.memo.scope !== "observation" ||
      input.memo.source_ids.some(
        (id) => id !== `EVIDENCE_${input.observation_id}_r${revision}`,
      )
    )
      throw new Error("Ungültiger Bezug des individuellen Memos.");
    tx.insert(observationEvidence)
      .values({
        id: `EVIDENCE_${input.observation_id}_r${revision}`,
        observation_id: input.observation_id,
        revision,
        input: validated.value!,
      })
      .run();
    return revision;
  });
}
