"use server";

import { db } from "@/db";
import { targetShares, workAreas } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function verifyWorkArea(workAreaId: string) {
  const [wa] = await db.select().from(workAreas).where(eq(workAreas.id, workAreaId));
  if (!wa) throw new Error("Nicht gefunden");
  return wa;
}

export async function upsertTargetShares(
  workAreaId: string,
  studyId: string,
  category: "Mitarbeiter" | "Maschine",
  formData: FormData
) {
  await verifyWorkArea(workAreaId);

  const gruppen = ["HT", "NT", "VS", "FK"] as const;

  for (const gruppe of gruppen) {
    const raw = formData.get(`share_${gruppe}`) as string;
    const pct = parseFloat(raw) || 0;
    const share = pct / 100;

    const [existing] = await db
      .select()
      .from(targetShares)
      .where(
        and(
          eq(targetShares.work_area_id, workAreaId),
          eq(targetShares.category, category),
          eq(targetShares.gruppe, gruppe)
        )
      );

    if (existing) {
      await db
        .update(targetShares)
        .set({ share })
        .where(eq(targetShares.id, existing.id));
    } else {
      await db.insert(targetShares).values({
        work_area_id: workAreaId,
        category,
        gruppe,
        share,
      });
    }
  }

  revalidatePath(`/studies/${studyId}/work-areas/${workAreaId}/target-shares`);
}
