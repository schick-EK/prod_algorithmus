import { db } from "@/db";
import { studies, workAreas, shifts } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { deleteShift } from "./actions";
import ShiftForm from "./ShiftForm";

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default async function ShiftsPage({
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

  const shiftList = await db
    .select()
    .from(shifts)
    .where(eq(shifts.work_area_id, workAreaId))
    .orderBy(asc(shifts.created_at));

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Studien", href: "/studies" },
          { label: study.name, href: `/studies/${studyId}` },
          { label: "Produktionssysteme", href: `/studies/${studyId}/work-areas` },
          { label: workArea.name, href: `/studies/${studyId}/work-areas/${workAreaId}` },
          { label: "Schichten" },
        ]}
      />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Schichten</h1>

      <ShiftForm workAreaId={workAreaId} studyId={studyId} />

      {/* List */}
      {shiftList.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {shiftList.map((shift) => {
            const weekdays = (shift.weekdays as number[]) ?? [];
            const breaks = (shift.breaks as { start: string; end: string }[]) ?? [];
            return (
              <div key={shift.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {shift.name || "Schicht"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {shift.start_time} – {shift.end_time}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {weekdays.map((d) => WEEKDAY_LABELS[d - 1]).join(", ")}
                    </p>
                    {breaks.length > 0 && (
                      <p className="text-xs text-gray-400">
                        Pausen:{" "}
                        {breaks.map((b) => `${b.start}–${b.end}`).join(", ")}
                      </p>
                    )}
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await deleteShift(workAreaId, studyId, shift.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Löschen
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
