"use server";

import { db } from "@/db";
import { activityTypes, studies } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createActivityType(studyId: string, formData: FormData) {
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  const label = formData.get("label") as string;
  const gruppe = formData.get("gruppe") as "HT" | "NT" | "VS" | "FK";
  const category = (formData.get("category") as string) || null;

  const existing = await db
    .select({ sort_order: activityTypes.sort_order })
    .from(activityTypes)
    .where(eq(activityTypes.study_id, studyId));
  const maxOrder = existing.length > 0 ? Math.max(...existing.map((e) => e.sort_order)) + 1 : 0;

  await db.insert(activityTypes).values({
    study_id: studyId,
    label,
    gruppe,
    category,
    sort_order: maxOrder,
  });

  revalidatePath(`/studies/${studyId}/activities`);
}

export async function deleteActivityType(studyId: string, activityTypeId: string) {
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Nicht gefunden");

  await db
    .delete(activityTypes)
    .where(and(eq(activityTypes.id, activityTypeId), eq(activityTypes.study_id, studyId)));

  revalidatePath(`/studies/${studyId}/activities`);
}
