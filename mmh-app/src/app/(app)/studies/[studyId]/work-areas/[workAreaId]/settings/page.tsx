"use server";

import { db } from "@/db";
import { studies, workAreas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { revalidatePath } from "next/cache";

async function updateWorkArea(studyId: string, workAreaId: string, formData: FormData) {
  "use server";
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  const name = formData.get("name") as string;
  const cycle_time = formData.get("cycle_time") as string;

  await db
    .update(workAreas)
    .set({ name, cycle_time: cycle_time ? parseFloat(cycle_time) : null })
    .where(and(eq(workAreas.id, workAreaId), eq(workAreas.study_id, studyId)));

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}`);
  redirect(`/studies/${studyId}/work-areas/${workAreaId}`);
}

async function deleteWorkArea(studyId: string, workAreaId: string) {
  "use server";
  await db.delete(workAreas).where(and(eq(workAreas.id, workAreaId), eq(workAreas.study_id, studyId)));
  revalidatePath(`/studies/${studyId}/work-areas`);
  redirect(`/studies/${studyId}/work-areas`);
}

export default async function WorkAreaSettingsPage({
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

  const updateAction = updateWorkArea.bind(null, studyId, workAreaId);
  const deleteAction = deleteWorkArea.bind(null, studyId, workAreaId);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Einstellungen" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Produktionssystem bearbeiten</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl">
        <form action={updateAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bezeichnung *
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={workArea.name}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taktzeit (Sekunden, optional)
            </label>
            <input
              name="cycle_time"
              type="number"
              step="0.1"
              min="0"
              defaultValue={workArea.cycle_time ?? ""}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Speichern
            </button>
            <a
              href={`/studies/${studyId}/work-areas/${workAreaId}`}
              className="px-5 py-2 rounded text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </a>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-red-700 mb-2">Produktionssystem löschen</h3>
          <p className="text-xs text-gray-500 mb-3">
            Alle Stationen, Schichten und Beobachtungen werden gelöscht.
          </p>
          <form action={deleteAction}>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Löschen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
