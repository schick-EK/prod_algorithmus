import { db } from "@/db";
import { studies, workAreas, stations, shifts, plannedRounds, observations } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default async function WorkAreaPage({
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

  const [stationCount] = await db
    .select({ count: count() })
    .from(stations)
    .where(eq(stations.work_area_id, workAreaId));

  const [shiftCount] = await db
    .select({ count: count() })
    .from(shifts)
    .where(eq(shifts.work_area_id, workAreaId));

  const [roundCount] = await db
    .select({ count: count() })
    .from(plannedRounds)
    .where(eq(plannedRounds.work_area_id, workAreaId));

  const [obsCount] = await db
    .select({ count: count() })
    .from(observations)
    .where(eq(observations.work_area_id, workAreaId));

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name },
        ]}
      />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{workArea.name}</h1>
          {workArea.cycle_time && (
            <p className="text-sm text-gray-500 mt-1">
              Taktzeit: {workArea.cycle_time} s
            </p>
          )}
        </div>
        <Link
          href={`/studies/${studyId}/work-areas/${workAreaId}/settings`}
          className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
        >
          Einstellungen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-900">{stationCount.count}</div>
          <div className="text-xs text-gray-500 mt-0.5">Stationen</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-900">{shiftCount.count}</div>
          <div className="text-xs text-gray-500 mt-0.5">Schichten</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-900">{roundCount.count}</div>
          <div className="text-xs text-gray-500 mt-0.5">Rundgänge</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-gray-900">{obsCount.count}</div>
          <div className="text-xs text-gray-500 mt-0.5">Beobachtungen</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`/studies/${studyId}/work-areas/${workAreaId}/stations`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Arbeitsstationen</h2>
          <p className="text-sm text-gray-500 mt-1">Stationen konfigurieren und Ablaufarten zuweisen</p>
        </Link>
        <Link
          href={`/studies/${studyId}/work-areas/${workAreaId}/shifts`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Schichten</h2>
          <p className="text-sm text-gray-500 mt-1">Arbeitszeiten und Pausen konfigurieren</p>
        </Link>
        <Link
          href={`/studies/${studyId}/work-areas/${workAreaId}/target-shares`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Sollwerte</h2>
          <p className="text-sm text-gray-500 mt-1">Zielanteile HT/NT/VS/FK festlegen</p>
        </Link>
        <Link
          href={`/studies/${studyId}/work-areas/${workAreaId}/rounds`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Rundgänge</h2>
          <p className="text-sm text-gray-500 mt-1">Beobachtungsrundgänge starten und verwalten</p>
        </Link>
      </div>
    </div>
  );
}
