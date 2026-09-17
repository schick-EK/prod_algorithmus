import { db } from "@/db";
import {
  studies,
  workAreas,
  stations,
  observations,
  activityTypes,
  roundNotes,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";
import { gruppeLabel, padCode } from "@/lib/format";

function escapeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatCSVDate(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function formatCSVTime(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const studyId = url.searchParams.get("studyId");
  const category = url.searchParams.get("category");
  const workAreaId = url.searchParams.get("workAreaId");
  const stationIdParam = url.searchParams.get("stationId");
  const daysParam = url.searchParams.get("days");

  if (!studyId) {
    return new Response("Missing studyId", { status: 400 });
  }

  const [study] = await db
    .select()
    .from(studies)
    .where(eq(studies.id, studyId));

  if (!study) {
    return new Response("Not found", { status: 404 });
  }

  const cat = (
    category === "Maschine" ? "Maschine" : "Mitarbeiter"
  ) as "Mitarbeiter" | "Maschine";

  const selectedStationIds = stationIdParam
    ? stationIdParam.split(",").filter(Boolean)
    : [];

  const selectedDays = daysParam
    ? daysParam
        .split(",")
        .map(Number)
        .filter((d) => d >= 1 && d <= 7)
    : [];

  // Fetch observations with joins
  const obsData = await db
    .select({
      obs_id: observations.id,
      observed_at: observations.observed_at,
      study_id: observations.study_id,
      work_area_id: observations.work_area_id,
      station_id: observations.station_id,
      planned_round_id: observations.planned_round_id,
      activity_label: activityTypes.label,
      activity_gruppe: activityTypes.gruppe,
      station_name: stations.name,
      station_category: stations.category,
      employee_count: stations.employee_count,
      station_sort: stations.sort_order,
      work_area_name: workAreas.name,
      work_area_sort: workAreas.sort_order,
    })
    .from(observations)
    .innerJoin(activityTypes, eq(observations.activity_type_id, activityTypes.id))
    .leftJoin(stations, eq(observations.station_id, stations.id))
    .innerJoin(workAreas, eq(observations.work_area_id, workAreas.id))
    .where(
      and(
        eq(observations.study_id, studyId),
        eq(stations.category, cat),
        ...(workAreaId ? [eq(observations.work_area_id, workAreaId)] : []),
        ...(selectedStationIds.length > 0
          ? [inArray(observations.station_id, selectedStationIds)]
          : [])
      )
    );

  // Day filter
  const filtered =
    selectedDays.length > 0
      ? obsData.filter((obs) => {
          const d = new Date(obs.observed_at);
          const jsDay = new Intl.DateTimeFormat("en-US", {
            timeZone: study.timezone,
            weekday: "long",
          }).format(d);
          const dayMap: Record<string, number> = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
            Sunday: 7,
          };
          return selectedDays.includes(dayMap[jsDay] ?? 0);
        })
      : obsData;

  // Compute codes: sequential per scope
  const allUserStudies = await db
    .select({ id: studies.id })
    .from(studies)
    .orderBy(studies.created_at);
  const studyCodeMap = new Map(
    allUserStudies.map((s, i) => [s.id, i + 1])
  );

  // Work area codes: within study
  const allWorkAreas = await db
    .select({ id: workAreas.id, sort_order: workAreas.sort_order, created_at: workAreas.created_at })
    .from(workAreas)
    .where(eq(workAreas.study_id, studyId))
    .orderBy(workAreas.sort_order, workAreas.created_at);
  const waCodeMap = new Map(allWorkAreas.map((wa, i) => [wa.id, i + 1]));

  // Station codes: within work area
  const allStations = await db
    .select({ id: stations.id, work_area_id: stations.work_area_id, sort_order: stations.sort_order })
    .from(stations)
    .innerJoin(workAreas, eq(stations.work_area_id, workAreas.id))
    .where(eq(workAreas.study_id, studyId))
    .orderBy(stations.sort_order, stations.created_at);

  // Group stations by work area for sequential codes
  const stationsByWa = new Map<string, string[]>();
  for (const s of allStations) {
    if (!stationsByWa.has(s.work_area_id)) stationsByWa.set(s.work_area_id, []);
    stationsByWa.get(s.work_area_id)!.push(s.id);
  }
  const stationCodeMap = new Map<string, number>();
  for (const [, stIds] of stationsByWa.entries()) {
    stIds.forEach((id, i) => stationCodeMap.set(id, i + 1));
  }

  // Get all round notes for included rounds
  const roundIds = [...new Set(filtered.map((o) => o.planned_round_id).filter(Boolean))] as string[];
  const notesData =
    roundIds.length > 0
      ? await db
          .select()
          .from(roundNotes)
          .where(inArray(roundNotes.planned_round_id, roundIds))
      : [];

  const noteMap = new Map<string, string>();
  for (const note of notesData) {
    const key = `${note.planned_round_id}:${note.station_id}`;
    noteMap.set(key, note.note ?? "");
  }

  // CSV header
  const headers = [
    "zeitstempel",
    "datum",
    "uhrzeit",
    "produktionsstandort_code",
    "produktionsstandort",
    "produktionssystem_code",
    "produktionssystem",
    "station_code",
    "arbeitsstation",
    "station_typ",
    "mitarbeiter_anzahl",
    "ablaufart_gruppe",
    "ablaufart",
    "rundgang_id",
    "notizen",
  ];

  const rows = filtered.map((obs) => {
    const d = new Date(obs.observed_at);
    const noteKey = `${obs.planned_round_id}:${obs.station_id}`;
    const stationTyp =
      obs.station_category === "Mitarbeiter" ? "Manuell" : "Maschinell";

    return [
      d.toISOString(),
      formatCSVDate(d, study.timezone),
      formatCSVTime(d, study.timezone),
      padCode(studyCodeMap.get(obs.study_id) ?? 0),
      study.name,
      padCode(waCodeMap.get(obs.work_area_id) ?? 0),
      obs.work_area_name ?? "",
      padCode(stationCodeMap.get(obs.station_id ?? "") ?? 0),
      obs.station_name ?? "",
      stationTyp,
      obs.station_category === "Mitarbeiter"
        ? String(obs.employee_count ?? "")
        : "",
      gruppeLabel(obs.activity_gruppe),
      obs.activity_label,
      obs.planned_round_id ?? "",
      noteMap.get(noteKey) ?? "",
    ].map(escapeCSV);
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const filename = `mmh_export_${study.name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
