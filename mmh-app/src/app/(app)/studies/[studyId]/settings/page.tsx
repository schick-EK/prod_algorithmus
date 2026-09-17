import { db } from "@/db";
import { studies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { updateStudy, deleteStudy } from "../../actions";

export default async function StudySettingsPage({
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

  const updateWithId = updateStudy.bind(null, studyId);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Einstellungen" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Studie bearbeiten</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl">
        <form action={updateWithId} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bezeichnung *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={study.name}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse / Standort
            </label>
            <input
              name="address"
              type="text"
              defaultValue={study.address ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Startdatum
              </label>
              <input
                name="start_date"
                type="date"
                defaultValue={study.start_date ?? ""}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enddatum
              </label>
              <input
                name="end_date"
                type="date"
                defaultValue={study.end_date ?? ""}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zeitzone
            </label>
            <select
              name="timezone"
              defaultValue={study.timezone}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Europe/Berlin">Europe/Berlin (MEZ/MESZ)</option>
              <option value="Europe/London">Europe/London</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfidenzniveau
            </label>
            <select
              name="confidence_level"
              defaultValue={study.confidence_level}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="90">90 %</option>
              <option value="95">95 % (Standard)</option>
              <option value="98">98 %</option>
              <option value="99">99 %</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Speichern
            </button>
            <a
              href={`/studies/${studyId}`}
              className="px-5 py-2 rounded text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </a>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-red-700 mb-2">Studie löschen</h3>
          <p className="text-xs text-gray-500 mb-3">
            Alle Produktionssysteme, Stationen, Schichten und Beobachtungen werden unwiderruflich gelöscht.
          </p>
          <form
            action={async () => {
              "use server";
              await deleteStudy(studyId);
            }}
          >
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
              onClick={(e) => {
                if (!confirm("Studie wirklich löschen?")) e.preventDefault();
              }}
            >
              Studie löschen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
