import { db } from "@/db";
import { studies, workAreas, plannedRounds, observations } from "@/db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDate, formatTime } from "@/lib/format";

export default async function RoundsPage({
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

  const rounds = await db
    .select({
      id: plannedRounds.id,
      planned_at: plannedRounds.planned_at,
      conducted_at: plannedRounds.conducted_at,
    })
    .from(plannedRounds)
    .where(eq(plannedRounds.work_area_id, workAreaId))
    .orderBy(desc(plannedRounds.planned_at));

  // Get observation counts per round
  const obsCounts = await db
    .select({
      planned_round_id: observations.planned_round_id,
      count: count(),
    })
    .from(observations)
    .where(eq(observations.work_area_id, workAreaId))
    .groupBy(observations.planned_round_id);

  const obsMap = new Map(
    obsCounts.map((o) => [o.planned_round_id, o.count])
  );

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Rundgänge" },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rundgänge</h1>
        <Link
          href={`/studies/${studyId}/work-areas/${workAreaId}/rounds/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Rundgang starten
        </Link>
      </div>

      {rounds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-3">Noch keine Rundgänge durchgeführt.</p>
          <Link
            href={`/studies/${studyId}/work-areas/${workAreaId}/rounds/new`}
            className="text-blue-600 hover:underline text-sm"
          >
            Ersten Rundgang starten
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {rounds.map((round) => (
            <div key={round.id} className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill
                    status={round.conducted_at ? "conducted" : "planned"}
                  />
                </div>
                <p className="text-sm text-gray-700">
                  Geplant: {formatDate(round.planned_at)}{" "}
                  {formatTime(round.planned_at)}
                </p>
                {round.conducted_at && (
                  <p className="text-sm text-gray-500">
                    Durchgeführt: {formatDate(round.conducted_at)}{" "}
                    {formatTime(round.conducted_at)}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {obsMap.get(round.id) ?? 0} Beobachtungen
                </p>
              </div>
              {!round.conducted_at && (
                <Link
                  href={`/studies/${studyId}/work-areas/${workAreaId}/rounds/${round.id}/conduct`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Fortfahren
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
