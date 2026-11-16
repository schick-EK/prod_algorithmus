"use server";

import { db } from "@/db";
import {
  loadObservationEvidence,
  manualEvidenceInput,
  saveEvidenceRevision,
} from "@/lib/annotation/evidence-store";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveEvidence(
  _previous: { error: string | null },
  form: FormData,
): Promise<{ error: string | null }> {
  const id = form.get("observation_id");
  const revisionValue = form.get("expected_revision");
  if (
    typeof id !== "string" ||
    typeof revisionValue !== "string" ||
    !/^\d+$/.test(revisionValue)
  )
    return { error: "Beobachtung oder Revision fehlt." };
  let studyId: string;
  try {
    const current = loadObservationEvidence(db, id);
    if (!current) return { error: "Beobachtung nicht gefunden." };
    const revision = Number(revisionValue);
    // Preserve the revision submitted by the form to reject stale browser tabs.
    const input = manualEvidenceInput(current.legacy, form, revision + 1);
    saveEvidenceRevision(db, input, revision);
    studyId = current.source.study_id;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Die Evidenz konnte nicht gespeichert werden.",
    };
  }
  revalidatePath("/observations");
  revalidatePath("/observations/evidence");
  revalidatePath(`/observations/${encodeURIComponent(id)}/evidence`);
  redirect(
    `/observations/${encodeURIComponent(id)}/evidence?${new URLSearchParams({ saved: "1", studyId })}`,
  );
}
