import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { activityTypes, observations, roundNotes, studies } from "@/db/schema";
import { adaptLegacyObservation } from "@/lib/annotation/legacy-adapter";
import { annotate } from "@/lib/annotation/pipeline";
import { ontology } from "@/lib/annotation/ontology";

export const runtime = "nodejs";

/** Read-only, study-wide handoff. Existing chart filters intentionally do not apply. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const studyId = params.get("studyId");
  const mode = params.get("mode") ?? "input";
  if (!studyId?.trim()) return Response.json({ error: "studyId required" }, { status: 400 });
  if (mode !== "input" && mode !== "baseline") return Response.json({ error: "mode must be input or baseline" }, { status: 400 });

  // One SQLite read transaction keeps observations and note references consistent.
  const inputs = db.transaction(tx => {
    const study = tx.select({ id: studies.id }).from(studies).where(eq(studies.id, studyId)).get();
    if (!study) return null;
    const rows = tx.select({
      id: observations.id,
      study_id: observations.study_id,
      work_area_id: observations.work_area_id,
      station_id: observations.station_id,
      planned_round_id: observations.planned_round_id,
      observed_at: observations.observed_at,
      activity_type_id: observations.activity_type_id,
      activity_label: activityTypes.label,
      activity_gruppe: activityTypes.gruppe,
    }).from(observations)
      .innerJoin(activityTypes, eq(observations.activity_type_id, activityTypes.id))
      .where(eq(observations.study_id, studyId))
      .orderBy(observations.observed_at, observations.id).all();
    const notes = tx.selectDistinct({
      id: roundNotes.id,
      planned_round_id: roundNotes.planned_round_id,
      station_id: roundNotes.station_id,
      note: roundNotes.note,
    }).from(roundNotes)
      .innerJoin(observations, and(eq(observations.planned_round_id, roundNotes.planned_round_id), eq(observations.station_id, roundNotes.station_id)))
      .where(eq(observations.study_id, studyId)).all();
    const byScope = new Map<string, typeof notes>();
    for (const note of notes) {
      const key = JSON.stringify([note.planned_round_id, note.station_id]);
      const group = byScope.get(key) ?? [];
      group.push(note);
      byScope.set(key, group);
    }
    return rows.map(row => adaptLegacyObservation(row, byScope.get(JSON.stringify([row.planned_round_id, row.station_id])) ?? []));
  });
  if (inputs === null) return Response.json({ error: "Study not found" }, { status: 404 });
  const records = mode === "baseline" ? inputs.map(input => annotate(input)) : inputs;
  const content = records.map(record => JSON.stringify(record)).join("\n");
  return new Response(content ? `${content}\n` : "", {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Content-Disposition": `attachment; filename="ap3-${mode}.jsonl"`,
      "Cache-Control": "no-store",
      "X-AP3-Record-Count": String(records.length),
      "X-AP3-Ontology-Version": ontology.version,
      "X-AP3-Calibration": "none",
    },
  });
}
