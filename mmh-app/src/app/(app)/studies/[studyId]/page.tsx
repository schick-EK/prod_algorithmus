import { db } from "@/db";
import { studies, workAreas, activityTypes, observations } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default async function StudyPage({
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

  const [waCount] = await db
    .select({ count: count() })
    .from(workAreas)
    .where(eq(workAreas.study_id, studyId));

  const [actCount] = await db
    .select({ count: count() })
    .from(activityTypes)
    .where(eq(activityTypes.study_id, studyId));

  const [obsCount] = await db
    .select({ count: count() })
    .from(observations)
    .where(eq(observations.study_id, studyId));

  return (
    <div>
      <Breadcrumb items={[{ label: "Studien", href: "/studies" }, { label: study.name }]} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{study.name}</h1>
          {study.address && (
            <p className="text-sm text-gray-500 mt-1">{study.address}</p>
          )}
          <p className="text-sm text-gray-400 mt-0.5">
            Konfidenzniveau: {study.confidence_level} % · Zeitzone: {study.timezone}
          </p>
          {study.start_date && (
            <p className="text-sm text-gray-400">
              {study.start_date} – {study.end_date || "offen"}
            </p>
          )}
        </div>
        <Link
          href={`/studies/${studyId}/settings`}
          className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
        >
          Einstellungen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{waCount.count}</div>
          <div className="text-sm text-gray-500 mt-1">Produktionssysteme</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{actCount.count}</div>
          <div className="text-sm text-gray-500 mt-1">Ablaufarten</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{obsCount.count}</div>
          <div className="text-sm text-gray-500 mt-1">Beobachtungen</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`/studies/${studyId}/work-areas`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Produktionssysteme</h2>
          <p className="text-sm text-gray-500 mt-1">
            Arbeitsbereiche, Stationen, Schichten konfigurieren
          </p>
        </Link>
        <Link
          href={`/studies/${studyId}/activities`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Ablaufartenkatalog</h2>
          <p className="text-sm text-gray-500 mt-1">
            HT / NT / VS / FK Ablaufarten definieren
          </p>
        </Link>
        <Link
          href={`/observations?studyId=${studyId}`}
          className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">Auswertung</h2>
          <p className="text-sm text-gray-500 mt-1">
            Beobachtungen analysieren und exportieren
          </p>
        </Link>
      </div>
    </div>
  );
}
