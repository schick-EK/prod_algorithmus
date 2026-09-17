"use server";

import { db } from "@/db";
import { shifts, workAreas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { parseTime } from "@/lib/format";

async function verifyWorkArea(workAreaId: string) {
  const [wa] = await db.select().from(workAreas).where(eq(workAreas.id, workAreaId));
  if (!wa) throw new Error("Nicht gefunden");
  return wa;
}

export async function createShift(workAreaId: string, studyId: string, formData: FormData) {
  await verifyWorkArea(workAreaId);

  const name = (formData.get("name") as string) || null;
  const start_time = parseTime(formData.get("start_time") as string);
  const end_time = parseTime(formData.get("end_time") as string);

  const weekdaysRaw = formData.getAll("weekdays") as string[];
  const weekdays = weekdaysRaw.map(Number).filter((n) => n >= 1 && n <= 7);

  const breaksRaw = (formData.get("breaks") as string) || "[]";
  let breaks: { start: string; end: string }[] = [];
  try {
    breaks = JSON.parse(breaksRaw);
  } catch {
    breaks = [];
  }

  await db.insert(shifts).values({
    work_area_id: workAreaId,
    name,
    start_time,
    end_time,
    weekdays,
    breaks,
  });

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/shifts`);
}

export async function deleteShift(workAreaId: string, studyId: string, shiftId: string) {
  await verifyWorkArea(workAreaId);

  await db
    .delete(shifts)
    .where(and(eq(shifts.id, shiftId), eq(shifts.work_area_id, workAreaId)));

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/shifts`);
}
