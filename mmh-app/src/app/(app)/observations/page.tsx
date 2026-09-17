import { db } from "@/db";
import {
  studies,
  workAreas,
  stations,
  observations,
  activityTypes,
  targetShares,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { calculateSampleSize } from "@/lib/sampleSize";
import { gruppeLabel } from "@/lib/format";
import ChartsSection from "./ChartsSection";

export default async function ObservationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    studyId?: string;
    category?: string;
    workAreaId?: string;
    stationId?: string;
    days?: string;
  }>;
}) {
  const params = await searchParams;

  const { studyId, category, workAreaId, stationId, days } = params;

  // Load studies for the selector
  const userStudies = await db
    .select({ id: studies.id, name: studies.name })
    .from(studies);

  // If no study selected, show selector only
  if (!studyId) {
    return (
      <div>
        <Breadcrumb items={[{ label: "Auswertung" }]} />
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Auswertung</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md">
          <p className="text-gray-600 mb-4">Bitte wählen Sie eine Studie aus:</p>
          <div className="space-y-2">
            {userStudies.map((s) => (
              <Link
                key={s.id}
                href={`/observations?studyId=${s.id}&category=Mitarbeiter`}
                className="block px-4 py-3 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 text-sm font-medium text-gray-900 transition-colors"
              >
                {s.name}
              </Link>
            ))}
            {userStudies.length === 0 && (
              <p className="text-gray-400 text-sm">Keine Studien vorhanden.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const [study] = await db
    .select()
    .from(studies)
    .where(eq(studies.id, studyId));

  if (!study) {
    return <div className="text-red-600">Studie nicht gefunden.</div>;
  }

  const cat = (category === "Maschine" ? "Maschine" : "Mitarbeiter") as
    | "Mitarbeiter"
    | "Maschine";

  // Load work areas
  const workAreaList = await db
    .select()
    .from(workAreas)
    .where(eq(workAreas.study_id, studyId));

  // Load stations for selected work area (for filter)
  const stationList = workAreaId
    ? await db
        .select()
        .from(stations)
        .where(
          and(
            eq(stations.work_area_id, workAreaId),
            eq(stations.category, cat)
          )
        )
    : [];

  // Stations visible in picker (employee_count >= 3 for MA, all for Maschine)
  const pickerStations = stationList.filter((s) =>
    cat === "Mitarbeiter" ? (s.employee_count ?? 0) >= 3 : true
  );

  // Parse station filter
  const selectedStationIds = stationId
    ? stationId.split(",").filter(Boolean)
    : [];

  // Parse days filter
  const selectedDays = days
    ? days
        .split(",")
        .map(Number)
        .filter((d) => d >= 1 && d <= 7)
    : [];

  // Build observations query
  const obsQuery = db
    .select({
      id: observations.id,
      observed_at: observations.observed_at,
      activity_type_id: observations.activity_type_id,
      station_id: observations.station_id,
      work_area_id: observations.work_area_id,
      gruppe: activityTypes.gruppe,
      label: activityTypes.label,
      station_category: stations.category,
      employee_count: stations.employee_count,
    })
    .from(observations)
    .innerJoin(activityTypes, eq(observations.activity_type_id, activityTypes.id))
    .leftJoin(stations, eq(observations.station_id, stations.id))
    .where(
      and(
        eq(observations.study_id, studyId),
        eq(stations.category, cat),
        ...(workAreaId ? [eq(observations.work_area_id, workAreaId)] : []),
        ...(selectedStationIds.length > 0
          ? [inArray(observations.station_id, selectedStationIds)]
          : []),
      )
    );

  const obsData = await obsQuery;

  // Filter by days (in application layer, using study timezone)
  const filteredObs =
    selectedDays.length > 0
      ? obsData.filter((obs) => {
          const d = new Date(obs.observed_at);
          // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
          // Our convention: 1=Mon..7=Sun
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
          const dayNum = dayMap[jsDay] ?? 0;
          return selectedDays.includes(dayNum);
        })
      : obsData;

  const totalObs = filteredObs.length;

  // Compute group totals for donut and bar chart
  const gruppeMap = new Map<string, Map<string, number>>();
  for (const obs of filteredObs) {
    const g = obs.gruppe;
    const l = obs.label;
    if (!gruppeMap.has(g)) gruppeMap.set(g, new Map());
    const inner = gruppeMap.get(g)!;
    inner.set(l, (inner.get(l) ?? 0) + 1);
  }

  const donutData: { name: string; gruppe: string; value: number; label: string }[] = [];
  for (const [gruppe, actMap] of gruppeMap.entries()) {
    for (const [label, value] of actMap.entries()) {
      donutData.push({ name: label, gruppe, value, label });
    }
  }

  // Bar chart: actual vs target
  const GRUPPEN = ["HT", "NT", "VS", "FK"] as const;

  // Load target shares for this study/work area/category
  const tsQuery = workAreaId
    ? await db
        .select()
        .from(targetShares)
        .where(
          and(
            eq(targetShares.work_area_id, workAreaId),
            eq(targetShares.category, cat)
          )
        )
    : await db
        .select()
        .from(targetShares)
        .innerJoin(workAreas, eq(targetShares.work_area_id, workAreas.id))
        .where(
          and(
            eq(workAreas.study_id, studyId),
            eq(targetShares.category, cat)
          )
        );

  // Average targets across work areas
  const targetMap = new Map<string, number[]>();
  for (const ts of tsQuery) {
    const share = "share" in ts ? ts.share : (ts as { target_shares: { share: number } }).target_shares?.share;
    const gruppe = "gruppe" in ts ? ts.gruppe : (ts as { target_shares: { gruppe: string } }).target_shares?.gruppe;
    if (gruppe && share != null) {
      if (!targetMap.has(gruppe)) targetMap.set(gruppe, []);
      targetMap.get(gruppe)!.push((share as number) * 100);
    }
  }

  function avgTarget(gruppe: string): number {
    const vals = targetMap.get(gruppe) ?? [];
    if (vals.length === 0) return 0;
    return vals.reduce((s, v) => s + v, 0) / vals.length;
  }

  const barData = GRUPPEN.map((g) => {
    const gruppeCount = filteredObs.filter((o) => o.gruppe === g).length;
    const actual = totalObs > 0 ? (gruppeCount / totalObs) * 100 : 0;
    const target = avgTarget(g);
    return {
      gruppe: g,
      label: gruppeLabel(g),
      actual: Math.round(actual * 10) / 10,
      target: Math.round(target * 10) / 10,
    };
  });

  // Sample size calculation
  const htTargets = targetMap.get("HT") ?? [];
  const avgHtTarget =
    htTargets.length > 0
      ? htTargets.reduce((s, v) => s + v, 0) / htTargets.length / 100
      : null;

  let sampleSizeResult: { nRequired: number; nRemaining: number } | null = null;
  if (avgHtTarget !== null) {
    sampleSizeResult = calculateSampleSize(
      avgHtTarget,
      study.confidence_level,
      totalObs
    );
  }

  // Histogram data
  const histObs = filteredObs.map((o) => ({
    observed_at: o.observed_at.toISOString(),
  }));

  const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const studyIdStr = studyId as string;
  function buildUrl(overrides: Record<string, string | undefined>) {
    const base: Record<string, string> = {
      studyId: studyIdStr,
      category: cat,
      ...(workAreaId ? { workAreaId } : {}),
      ...(selectedStationIds.length ? { stationId: selectedStationIds.join(",") } : {}),
      ...(selectedDays.length ? { days: selectedDays.join(",") } : {}),
    };
    const merged = { ...base, ...overrides };
    const qs = Object.entries(merged)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/observations?${qs}`;
  }

  return (
    <div>
      <Breadcrumb items={[{ label: "Auswertung" }]} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Auswertung</h1>
        <a
          href={`/observations/export?studyId=${studyId}&category=${cat}${workAreaId ? `&workAreaId=${workAreaId}` : ""}${selectedStationIds.length ? `&stationId=${selectedStationIds.join(",")}` : ""}${selectedDays.length ? `&days=${selectedDays.join(",")}` : ""}`}
          className="text-sm text-blue-600 border border-blue-300 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors"
        >
          CSV exportieren
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
        {/* Study selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-gray-700">Studie:</label>
          <form method="GET" action="/observations" className="flex items-center gap-2">
            <input type="hidden" name="category" value={cat} />
            <select
              name="studyId"
              defaultValue={studyId}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {userStudies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button type="submit" className="px-2 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
              Wählen
            </button>
          </form>

          {/* Category toggle */}
          <div className="flex gap-1 ml-4">
            <Link
              href={buildUrl({ category: "Mitarbeiter", workAreaId: undefined, stationId: undefined })}
              className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                cat === "Mitarbeiter"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Manuelle Arbeitsstationen
            </Link>
            <Link
              href={buildUrl({ category: "Maschine", workAreaId: undefined, stationId: undefined })}
              className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                cat === "Maschine"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Maschinelle Arbeitsstationen
            </Link>
          </div>
        </div>

        {/* Work area filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-sm font-medium text-gray-700">Produktionssystem:</label>
          <Link
            href={buildUrl({ workAreaId: undefined, stationId: undefined })}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              !workAreaId
                ? "bg-gray-800 text-white border-gray-800"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Alle
          </Link>
          {workAreaList.map((wa) => (
            <Link
              key={wa.id}
              href={buildUrl({ workAreaId: wa.id, stationId: undefined })}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                workAreaId === wa.id
                  ? "bg-gray-800 text-white border-gray-800"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {wa.name}
            </Link>
          ))}
        </div>

        {/* Station filter (only when work area selected) */}
        {workAreaId && pickerStations.length > 0 && (
          <div className="flex items-start gap-3">
            <label className="text-sm font-medium text-gray-700 pt-0.5">
              Stationen:
            </label>
            <div className="flex gap-2 flex-wrap">
              {pickerStations.map((s) => {
                const newIds = selectedStationIds.includes(s.id)
                  ? selectedStationIds.filter((id) => id !== s.id)
                  : [...selectedStationIds, s.id];
                return (
                  <Link
                    key={s.id}
                    href={buildUrl({
                      stationId: newIds.length > 0 ? newIds.join(",") : undefined,
                    })}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                      selectedStationIds.includes(s.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : selectedStationIds.length === 0
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {s.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Day filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm font-medium text-gray-700">Wochentage:</label>
          {WEEKDAY_LABELS.map((label, i) => {
            const dayNum = i + 1;
            const isSelected = selectedDays.includes(dayNum);
            const newDays = isSelected
              ? selectedDays.filter((d) => d !== dayNum)
              : [...selectedDays, dayNum];
            return (
              <Link
                key={dayNum}
                href={buildUrl({
                  days: newDays.length > 0 ? newDays.join(",") : undefined,
                })}
                className={`px-2 py-1 rounded text-xs border transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : selectedDays.length === 0
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{totalObs}</div>
          <div className="text-xs text-gray-500 mt-1">Beobachtungen gesamt</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          {sampleSizeResult !== null ? (
            <>
              <div className="text-2xl font-bold text-gray-900">
                {sampleSizeResult.nRequired}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Erforderlich (n, {study.confidence_level} %)
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-medium text-gray-400">—</div>
              <div className="text-xs text-gray-400 mt-1">
                Kein HT-Sollwert hinterlegt
              </div>
            </>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          {sampleSizeResult !== null ? (
            <>
              <div
                className={`text-2xl font-bold ${
                  sampleSizeResult.nRemaining === 0
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {sampleSizeResult.nRemaining === 0
                  ? "✓ Erreicht"
                  : sampleSizeResult.nRemaining}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {sampleSizeResult.nRemaining === 0
                  ? "Stichprobengröße erreicht"
                  : "Noch erforderlich"}
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-medium text-gray-400">—</div>
              <div className="text-xs text-gray-400 mt-1">Stichprobengröße</div>
            </>
          )}
        </div>
      </div>

      {/* Charts */}
      {totalObs === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 text-gray-400">
          Keine Beobachtungen für die gewählten Filter.
        </div>
      ) : (
        <ChartsSection
          donutData={donutData}
          barData={barData}
          histObservations={histObs}
          timezone={study.timezone}
        />
      )}
    </div>
  );
}
