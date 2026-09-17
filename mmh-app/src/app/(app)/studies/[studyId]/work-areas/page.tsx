import { db } from "@/db";
import { studies, workAreas } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default async function WorkAreasPage({
  params,
}: {
  params: Promise<{ studyId: string }>;
}) {
  const { studyId } = await params;

  const [study] = await db
    .select()
    .from(studies)
    .where(eq(studies.id, studyId));

  if (!study) notFound();

  const areas = await db
    .select()
    .from(workAreas)
    .where(eq(workAreas.study_id, studyId))
    .orderBy(asc(workAreas.sort_order), asc(workAreas.created_at));

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme" },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produktionssysteme</h1>
        <Link
          href={`/studies/${studyId}/work-areas/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Neues Produktionssystem
        </Link>
      </div>

      {areas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-3">Keine Produktionssysteme vorhanden.</p>
          <Link
            href={`/studies/${studyId}/work-areas/new`}
            className="text-blue-600 hover:underline text-sm"
          >
            Erstes Produktionssystem anlegen
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {areas.map((wa) => (
            <Link
              key={wa.id}
              href={`/studies/${studyId}/work-areas/${wa.id}`}
              className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{wa.name}</h2>
                {wa.cycle_time && (
                  <span className="text-xs text-gray-400">
                    Taktzeit: {wa.cycle_time} s
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
