import { db } from "@/db";
import { studies, workAreas, stations } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createStation, deleteStation } from "./actions";

export default async function StationsPage({
  params,
}: {
  params: Promise<{ studyId: string; workAreaId: string }>;
}) {
  const { studyId, workAreaId } = await params;

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

  const stationList = await db
    .select()
    .from(stations)
    .where(eq(stations.work_area_id, workAreaId))
    .orderBy(asc(stations.sort_order), asc(stations.created_at));

  const createWithIds = createStation.bind(null, workAreaId, studyId);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Stationen" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Arbeitsstationen</h1>

      {/* Add form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Station hinzufügen</h2>
        <form action={createWithIds} className="flex gap-2 flex-wrap items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bezeichnung *</label>
            <input
              name="name"
              type="text"
              required
              placeholder="z.B. Station 1"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Typ *</label>
            <select
              name="category"
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Typ wählen</option>
              <option value="Mitarbeiter">Mitarbeiter</option>
              <option value="Maschine">Maschine</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Anzahl MA</label>
            <input
              name="employee_count"
              type="number"
              min="1"
              placeholder="z.B. 3"
              className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Hinzufügen
          </button>
        </form>
      </div>

      {/* List */}
      {stationList.length === 0 ? (
        <p className="text-gray-500 text-sm">Noch keine Stationen vorhanden.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {stationList.map((station) => (
            <div key={station.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                    station.category === "Mitarbeiter"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {station.category === "Mitarbeiter" ? "MA" : "M"}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {station.name}
                </span>
                {station.employee_count !== null && (
                  <span className="text-xs text-gray-400">
                    {station.employee_count} MA
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/studies/${studyId}/work-areas/${workAreaId}/stations/${station.id}/activities`}
                  className="text-xs text-blue-600 hover:underline px-2 py-1"
                >
                  Ablaufarten
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteStation(workAreaId, studyId, station.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                  >
                    Löschen
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
