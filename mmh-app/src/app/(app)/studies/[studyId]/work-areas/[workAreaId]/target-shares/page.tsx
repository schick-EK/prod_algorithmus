import { db } from "@/db";
import { studies, workAreas, targetShares } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { upsertTargetShares } from "./actions";

const GRUPPEN = ["HT", "NT", "VS", "FK"] as const;
const GRUPPE_LABELS: Record<string, string> = {
  HT: "Haupttätigkeit",
  NT: "Nebentätigkeit",
  VS: "Verschwendung",
  FK: "Freie Kapazität",
};

type Category = "Mitarbeiter" | "Maschine";

export default async function TargetSharesPage({
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

  const shares = await db
    .select()
    .from(targetShares)
    .where(eq(targetShares.work_area_id, workAreaId));

  function getShare(category: Category, gruppe: string): number {
    const entry = shares.find(
      (s) => s.category === category && s.gruppe === gruppe
    );
    return entry ? Math.round(entry.share * 100) : 0;
  }

  function renderCategory(category: Category) {
    const upsertAction = upsertTargetShares.bind(null, workAreaId, studyId, category);
    const total = GRUPPEN.reduce((sum, g) => sum + getShare(category, g), 0);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 max-w-md">
        <h2 className="font-semibold text-gray-900 mb-4">{category}</h2>
        <form action={upsertAction} className="space-y-3">
          {GRUPPEN.map((gruppe) => (
            <div key={gruppe} className="flex items-center gap-3">
              <label className="w-32 text-sm text-gray-700">
                <span className="font-medium">{gruppe}</span>{" "}
                <span className="text-xs text-gray-400">{GRUPPE_LABELS[gruppe]}</span>
              </label>
              <input
                name={`share_${gruppe}`}
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue={getShare(category, gruppe)}
                className="w-20 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-400">%</span>
            </div>
          ))}
          <div
            className={`flex items-center gap-2 pt-2 border-t border-gray-100 text-sm ${
              total === 100
                ? "text-green-600"
                : total > 100
                ? "text-red-600"
                : "text-orange-600"
            }`}
          >
            <span>Summe: {total} %</span>
            {total !== 100 && (
              <span className="text-xs">
                {total > 100 ? "(über 100 %!)" : "(muss 100 % ergeben)"}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors mt-2"
          >
            Speichern
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Sollwerte" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sollwerte (Zielanteile)
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderCategory("Mitarbeiter")}
        {renderCategory("Maschine")}
      </div>
    </div>
  );
}
