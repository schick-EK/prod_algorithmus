import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  observations,
  observationEvidence,
  studies,
  activityTypes,
} from "@/db/schema";

export default async function EvidenceList({
  searchParams,
}: {
  searchParams: Promise<{ studyId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const study = params.studyId
    ? db.select().from(studies).where(eq(studies.id, params.studyId)).get()
    : undefined;
  if (!study)
    return (
      <p>
        Bitte zuerst eine Studie in der{" "}
        <Link href="/observations" className="text-blue-600">
          Auswertung
        </Link>{" "}
        wählen.
      </p>
    );
  const page = /^\d+$/.test(params.page ?? "")
    ? Math.max(1, Math.min(Number(params.page), 1000000))
    : 1;
  const rows = db
    .select({
      id: observations.id,
      observed_at: observations.observed_at,
      station_id: observations.station_id,
      label: activityTypes.label,
      revision: sql<number>`coalesce((select max(revision) from ${observationEvidence} where ${observationEvidence.observation_id} = ${observations.id}), 0)`,
    })
    .from(observations)
    .innerJoin(
      activityTypes,
      eq(activityTypes.id, observations.activity_type_id),
    )
    .where(and(eq(observations.study_id, study.id)))
    .orderBy(desc(observations.observed_at), observations.id)
    .limit(51)
    .offset((page - 1) * 50)
    .all();
  const pageUrl = (n: number) =>
    `/observations/evidence?${new URLSearchParams({ studyId: study.id, page: String(n) })}`;
  return (
    <div>
      <Link
        href={`/observations?${new URLSearchParams({ studyId: study.id })}`}
        className="text-sm text-blue-600"
      >
        ← Zur Auswertung
      </Link>
      <h1 className="my-4 text-2xl font-bold">
        Individuelle Beobachtungsevidenz
      </h1>
      <p className="mb-5 text-sm text-gray-600">
        {study.name} · Merkmale und Textmemos je Beobachtung prüfen oder
        nacherfassen. Ursprüngliche Ablaufarten und gemeinsame Stationsnotizen
        bleiben erhalten.
      </p>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Beobachtet</th>
              <th className="p-3">Ursprüngliche Ablaufart</th>
              <th className="p-3">Evidenz</th>
              <th className="p-3">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 50).map((row) => (
              <tr key={row.id} className="border-t border-gray-100">
                <td className="p-3">
                  {row.observed_at.toLocaleString("de-DE", {
                    timeZone: study.timezone,
                  })}
                </td>
                <td className="p-3">{row.label}</td>
                <td className="p-3">
                  {row.revision
                    ? `Revision ${row.revision}`
                    : "Noch nicht individuell erfasst"}
                </td>
                <td className="p-3">
                  <Link
                    href={`/observations/${encodeURIComponent(row.id)}/evidence`}
                    className="text-blue-600 hover:underline"
                  >
                    Evidenz bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="p-4 text-gray-500">
            Keine Beobachtungen auf dieser Seite.
          </p>
        )}
      </div>
      <div className="mt-4 flex gap-4 text-sm">
        {page > 1 && (
          <Link className="text-blue-600" href={pageUrl(page - 1)}>
            ← Vorherige Seite
          </Link>
        )}
        {rows.length > 50 && (
          <Link className="text-blue-600" href={pageUrl(page + 1)}>
            Nächste Seite →
          </Link>
        )}
      </div>
    </div>
  );
}
