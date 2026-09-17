"use server";

import { db } from "@/db";
import { stations, workAreas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function verifyWorkArea(workAreaId: string) {
  const [wa] = await db.select().from(workAreas).where(eq(workAreas.id, workAreaId));
  if (!wa) throw new Error("Nicht gefunden");
  return wa;
}

export async function createStation(workAreaId: string, studyId: string, formData: FormData) {
  await verifyWorkArea(workAreaId);

  const name = formData.get("name") as string;
  const category = formData.get("category") as "Mitarbeiter" | "Maschine";
  const employee_count_str = formData.get("employee_count") as string;
  const employee_count =
    category === "Mitarbeiter" && employee_count_str
      ? parseInt(employee_count_str)
      : null;

  const existing = await db
    .select({ sort_order: stations.sort_order })
    .from(stations)
    .where(eq(stations.work_area_id, workAreaId));
  const maxOrder = existing.length > 0 ? Math.max(...existing.map((e) => e.sort_order)) + 1 : 0;

  await db.insert(stations).values({
    work_area_id: workAreaId,
    name,
    category,
    employee_count,
    sort_order: maxOrder,
  });

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/stations`);
}

export async function updateStation(
  workAreaId: string,
  studyId: string,
  stationId: string,
  formData: FormData
) {
  await verifyWorkArea(workAreaId);

  const name = formData.get("name") as string;
  const category = formData.get("category") as "Mitarbeiter" | "Maschine";
  const employee_count_str = formData.get("employee_count") as string;
  const employee_count =
    category === "Mitarbeiter" && employee_count_str
      ? parseInt(employee_count_str)
      : null;

  await db
    .update(stations)
    .set({ name, category, employee_count })
    .where(and(eq(stations.id, stationId), eq(stations.work_area_id, workAreaId)));

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/stations`);
}

export async function deleteStation(
  workAreaId: string,
  studyId: string,
  stationId: string
) {
  await verifyWorkArea(workAreaId);

  await db
    .delete(stations)
    .where(and(eq(stations.id, stationId), eq(stations.work_area_id, workAreaId)));

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/stations`);
}
