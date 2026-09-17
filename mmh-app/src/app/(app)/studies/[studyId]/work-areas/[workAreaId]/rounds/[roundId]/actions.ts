"use server";

import { db } from "@/db";
import {
  observations,
  plannedRounds,
  roundNotes,
  studies,
  workAreas,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

export type RoundState = {
  s: Record<
    string,
    {
      c?: Record<string, number>;
      n?: string;
      nc?: boolean;
    }
  >;
};

export async function saveRound(
  roundId: string,
  roundState: RoundState,
  workAreaId: string,
  studyId: string
) {
  const [study] = await db
    .select()
    .from(studies)
    .where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  const [workArea] = await db
    .select()
    .from(workAreas)
    .where(and(eq(workAreas.id, workAreaId), eq(workAreas.study_id, studyId)));
  if (!workArea) throw new Error("Nicht gefunden");

  const [round] = await db
    .select()
    .from(plannedRounds)
    .where(
      and(
        eq(plannedRounds.id, roundId),
        eq(plannedRounds.work_area_id, workAreaId)
      )
    );
  if (!round) throw new Error("Rundgang nicht gefunden");

  const observedAt = new Date();

  const obsToInsert: {
    study_id: string;
    work_area_id: string;
    station_id: string;
    activity_type_id: string;
    observed_at: Date;
    planned_round_id: string;
  }[] = [];

  for (const [stationId, stationState] of Object.entries(roundState.s)) {
    const counts = stationState.c ?? {};
    for (const [activityTypeId, count] of Object.entries(counts)) {
      for (let i = 0; i < count; i++) {
        obsToInsert.push({
          study_id: studyId,
          work_area_id: workAreaId,
          station_id: stationId,
          activity_type_id: activityTypeId,
          observed_at: observedAt,
          planned_round_id: roundId,
        });
      }
    }
  }

  if (obsToInsert.length > 0) {
    await db.insert(observations).values(obsToInsert);
  }

  const notesToInsert: {
    planned_round_id: string;
    station_id: string;
    note: string | null;
    no_anomalies: boolean;
  }[] = [];

  for (const [stationId, stationState] of Object.entries(roundState.s)) {
    if (stationState.n || stationState.nc) {
      notesToInsert.push({
        planned_round_id: roundId,
        station_id: stationId,
        note: stationState.n || null,
        no_anomalies: stationState.nc ?? false,
      });
    }
  }

  if (notesToInsert.length > 0) {
    await db.insert(roundNotes).values(notesToInsert);
  }

  await db
    .update(plannedRounds)
    .set({ conducted_at: observedAt })
    .where(eq(plannedRounds.id, roundId));

  redirect(`/studies/${studyId}/work-areas/${workAreaId}/rounds`);
}
