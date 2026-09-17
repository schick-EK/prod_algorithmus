"use server";

import { db } from "@/db";
import { studies, workAreas, plannedRounds } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

async function startRound(studyId: string, workAreaId: string) {
  "use server";
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  const [round] = await db
    .insert(plannedRounds)
    .values({
      work_area_id: workAreaId,
    })
    .returning();

  redirect(`/studies/${studyId}/work-areas/${workAreaId}/rounds/${round.id}/conduct`);
}

export default async function NewRoundPage({
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

  const startAction = startRound.bind(null, studyId, workAreaId);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Rundgänge", href: `/studies/${studyId}/work-areas/${workAreaId}/rounds` },
          { label: "Neuer Rundgang" },
        ]}
      />
      <div className="max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rundgang starten</h1>
        <p className="text-gray-500 text-sm mb-8">
          Sie sind dabei, einen neuen Beobachtungsrundgang für <strong>{workArea.name}</strong> zu starten.
        </p>
        <form action={startAction}>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            Rundgang starten
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-400">
          Ein Rundgangsdatensatz wird erstellt und Sie werden zur Erfassungsmaske weitergeleitet.
        </p>
      </div>
    </div>
  );
}
