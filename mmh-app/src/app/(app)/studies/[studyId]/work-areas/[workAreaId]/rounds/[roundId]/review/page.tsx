import { db } from "@/db";
import {
  studies,
  workAreas,
  plannedRounds,
  stations,
  activityTypes,
  stationActivityTypes,
} from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ReviewClient from "./ReviewClient";
import type { RoundState } from "../actions";

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ studyId: string; workAreaId: string; roundId: string }>;
  searchParams: Promise<{ r?: string }>;
}) {
  const { studyId, workAreaId, roundId } = await params;
  const { r } = await searchParams;

  const [study] = await db
    .select()
    .from(studies)
    .where(eq(studies.id, studyId));
  if (!study) notFound();

  const [workArea] = await db
    .select()
    .from(workAreas)
    .where(and(eq(workAreas.id, workAreaId), eq(workAreas.study_id, studyId)));
  if (!workArea) notFound();

  const [round] = await db
    .select()
    .from(plannedRounds)
    .where(
      and(
        eq(plannedRounds.id, roundId),
        eq(plannedRounds.work_area_id, workAreaId)
      )
    );
  if (!round) notFound();

  let roundState: RoundState = { s: {} };
  if (r) {
    try {
      roundState = JSON.parse(decodeURIComponent(r));
    } catch {}
  }

  // Get stations
  const stationList = await db
    .select()
    .from(stations)
    .where(eq(stations.work_area_id, workAreaId))
    .orderBy(asc(stations.sort_order), asc(stations.created_at));

  // Get all activities for study
  const allActivities = await db
    .select()
    .from(activityTypes)
    .where(eq(activityTypes.study_id, studyId))
    .orderBy(asc(activityTypes.sort_order));

  // Get station-activity mappings
  const allSatMappings =
    stationList.length > 0
      ? await db.select().from(stationActivityTypes)
      : [];

  const stationsWithActivities = stationList.map((station) => {
    const assignedIds = allSatMappings
      .filter((m) => m.station_id === station.id)
      .map((m) => m.activity_type_id);

    const activities =
      assignedIds.length > 0
        ? allActivities.filter((a) => assignedIds.includes(a.id))
        : allActivities;

    return {
      id: station.id,
      name: station.name,
      category: station.category as "Mitarbeiter" | "Maschine",
      employee_count: station.employee_count,
      activities: activities.map((a) => ({
        id: a.id,
        label: a.label,
        gruppe: a.gruppe as "HT" | "NT" | "VS" | "FK",
      })),
    };
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          {
            label: "Rundgänge",
            href: `/studies/${studyId}/work-areas/${workAreaId}/rounds`,
          },
          {
            label: "Rundgang",
            href: `/studies/${studyId}/work-areas/${workAreaId}/rounds/${roundId}/conduct`,
          },
          { label: "Überprüfung" },
        ]}
      />
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Rundgang überprüfen – {workArea.name}
      </h1>
      <ReviewClient
        stations={stationsWithActivities}
        roundState={roundState}
        workAreaId={workAreaId}
        studyId={studyId}
        roundId={roundId}
      />
    </div>
  );
}
