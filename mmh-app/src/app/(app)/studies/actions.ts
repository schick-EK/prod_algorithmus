"use server";

import { db } from "@/db";
import { studies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireStudy(studyId: string) {
  const [study] = await db.select().from(studies).where(eq(studies.id, studyId));
  if (!study) throw new Error("Studie nicht gefunden");
  return study;
}

export async function createStudy(formData: FormData) {
  const name = formData.get("name") as string;
  const address = (formData.get("address") as string) || null;
  const start_date = (formData.get("start_date") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const timezone = (formData.get("timezone") as string) || "Europe/Berlin";
  const confidence_level = (formData.get("confidence_level") as "90" | "95" | "98" | "99") || "95";

  const [inserted] = await db
    .insert(studies)
    .values({
      name,
      address,
      start_date,
      end_date,
      timezone,
      confidence_level,
    })
    .returning();

  redirect(`/studies/${inserted.id}`);
}

export async function updateStudy(studyId: string, formData: FormData) {
  await requireStudy(studyId);

  const name = formData.get("name") as string;
  const address = (formData.get("address") as string) || null;
  const start_date = (formData.get("start_date") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const timezone = (formData.get("timezone") as string) || "Europe/Berlin";
  const confidence_level = (formData.get("confidence_level") as "90" | "95" | "98" | "99") || "95";

  await db
    .update(studies)
    .set({ name, address, start_date, end_date, timezone, confidence_level })
    .where(eq(studies.id, studyId));

  revalidatePath(`/studies/${studyId}`);
  redirect(`/studies/${studyId}`);
}

export async function deleteStudy(studyId: string) {
  await db.delete(studies).where(eq(studies.id, studyId));
  revalidatePath("/studies");
  redirect("/studies");
}
