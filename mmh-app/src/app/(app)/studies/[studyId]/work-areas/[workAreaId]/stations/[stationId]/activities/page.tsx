"use server";

import { db } from "@/db";
import { studies, workAreas, stations, activityTypes, stationActivityTypes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

async function updateStationActivities(
  studyId: string,
  workAreaId: string,
  stationId: string,
  formData: FormData
) {
  "use server";
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  const selected = formData.getAll("activity_type_id") as string[];

  await db
    .delete(stationActivityTypes)
    .where(eq(stationActivityTypes.station_id, stationId));

  if (selected.length > 0) {
    await db.insert(stationActivityTypes).values(
      selected.map((aid) => ({
        station_id: stationId,
        activity_type_id: aid,
      }))
    );
  }

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/stations/${stationId}/activities`);
}

export default async function StationActivitiesPage({
  params,
}: {
  params: Promise<{ studyId: string; workAreaId: string; stationId: string }>;
}) {
  const { studyId, workAreaId, stationId } = await params;

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

  const [station] = await db
    .select()
    .from(stations)
    .where(and(eq(stations.id, stationId), eq(stations.work_area_id, workAreaId)));
  if (!station) notFound();

  const allActivities = await db
    .select()
    .from(activityTypes)
    .where(eq(activityTypes.study_id, studyId))
    .orderBy(activityTypes.sort_order, activityTypes.created_at);

  const assigned = await db
    .select({ activity_type_id: stationActivityTypes.activity_type_id })
    .from(stationActivityTypes)
    .where(eq(stationActivityTypes.station_id, stationId));

  const assignedIds = new Set(assigned.map((a) => a.activity_type_id));

  const saveAction = updateStationActivities.bind(null, studyId, workAreaId, stationId);

  const gruppeColors: Record<string, string> = {
    HT: "bg-green-100 text-green-800 border-green-300",
    NT: "bg-orange-100 text-orange-800 border-orange-300",
    VS: "bg-red-100 text-red-800 border-red-300",
    FK: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Stationen", href: `/studies/${studyId}/work-areas/${workAreaId}/stations` },
          { label: station.name },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Ablaufarten – {station.name}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Wenn keine Ablaufarten zugewiesen sind, werden alle Studienkatalog-Ablaufarten verwendet.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-5 max-w-xl">
        <form action={saveAction} className="space-y-3">
          {allActivities.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Keine Ablaufarten im Studienkatalog. Bitte zuerst Ablaufarten anlegen.
            </p>
          ) : (
            <>
              {allActivities.map((act) => (
                <label key={act.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="activity_type_id"
                    value={act.id}
                    defaultChecked={assignedIds.has(act.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border ${gruppeColors[act.gruppe]}`}
                  >
                    {act.gruppe}
                  </span>
                  <span className="text-sm text-gray-900">{act.label}</span>
                  {act.category && (
                    <span className="text-xs text-gray-400">({act.category})</span>
                  )}
                </label>
              ))}
              <div className="pt-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Speichern
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
