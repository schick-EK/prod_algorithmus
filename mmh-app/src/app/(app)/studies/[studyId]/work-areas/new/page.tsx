"use server";

import { db } from "@/db";
import { studies, workAreas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

async function createWorkArea(studyId: string, formData: FormData) {
  "use server";
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  const name = formData.get("name") as string;
  const cycle_time = formData.get("cycle_time") as string;

  const [inserted] = await db
    .insert(workAreas)
    .values({
      study_id: studyId,
      name,
      cycle_time: cycle_time ? parseFloat(cycle_time) : null,
    })
    .returning();

  redirect(`/studies/${studyId}/work-areas/${inserted.id}`);
}

export default async function NewWorkAreaPage({
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

  const createAction = createWorkArea.bind(null, studyId);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: "Neues Produktionssystem" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Neues Produktionssystem
      </h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl">
        <form action={createAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bezeichnung *
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="z.B. Montagebereich A"
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
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="z.B. 60"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Anlegen
            </button>
            <a
              href={`/studies/${studyId}/work-areas`}
              className="px-5 py-2 rounded text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
