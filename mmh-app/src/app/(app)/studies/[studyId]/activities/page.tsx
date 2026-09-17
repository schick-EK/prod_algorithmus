import { db } from "@/db";
import { activityTypes, studies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { createActivityType, deleteActivityType } from "./actions";

const gruppeColors: Record<string, string> = {
  HT: "bg-green-100 text-green-800 border-green-300",
  NT: "bg-orange-100 text-orange-800 border-orange-300",
  VS: "bg-red-100 text-red-800 border-red-300",
  FK: "bg-gray-100 text-gray-700 border-gray-300",
};

const gruppeLabels: Record<string, string> = {
  HT: "Haupttätigkeit",
  NT: "Nebentätigkeit",
  VS: "Verschwendung",
  FK: "Freie Kapazität",
};

export default async function ActivitiesPage({
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

  const activities = await db
    .select()
    .from(activityTypes)
    .where(eq(activityTypes.study_id, studyId))
    .orderBy(asc(activityTypes.sort_order), asc(activityTypes.created_at));

  const createWithStudyId = createActivityType.bind(null, studyId);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Ablaufartenkatalog" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ablaufartenkatalog</h1>

      {/* Add form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 max-w-xl">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Ablaufart hinzufügen</h2>
        <form action={createWithStudyId} className="flex gap-2 flex-wrap">
          <input
            name="label"
            type="text"
            required
            placeholder="Bezeichnung"
            className="flex-1 min-w-40 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="gruppe"
            required
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Gruppe wählen</option>
            <option value="HT">HT – Haupttätigkeit</option>
            <option value="NT">NT – Nebentätigkeit</option>
            <option value="VS">VS – Verschwendung</option>
            <option value="FK">FK – Freie Kapazität</option>
          </select>
          <input
            name="category"
            type="text"
            placeholder="Kategorie (opt.)"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Hinzufügen
          </button>
        </form>
      </div>

      {/* List */}
      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm">Noch keine Ablaufarten definiert.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {activities.map((act) => (
            <div key={act.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${gruppeColors[act.gruppe]}`}
                >
                  {act.gruppe}
                </span>
                <span className="text-sm font-medium text-gray-900">{act.label}</span>
                {act.category && (
                  <span className="text-xs text-gray-400">({act.category})</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{gruppeLabels[act.gruppe]}</span>
                <form
                  action={async () => {
                    "use server";
                    await deleteActivityType(studyId, act.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 px-2 py-1"
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
