import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { loadObservationEvidence } from "@/lib/annotation/evidence-store";
import { annotate } from "@/lib/annotation/pipeline";
import EvidenceForm from "./EvidenceForm";

export default async function EvidencePage({
  params,
  searchParams,
}: {
  params: Promise<{ observationId: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { observationId } = await params;
  const current = loadObservationEvidence(db, observationId);
  if (!current) notFound();
  const result = annotate(current.input);
  const saved = (await searchParams).saved === "1";
  const positive = result.candidates
    .filter((c) => c.raw_score > 0)
    .sort((a, b) => b.raw_score - a.raw_score);
  return (
    <div className="space-y-5">
      <Link
        className="text-sm text-blue-600"
        href={`/observations/evidence?${new URLSearchParams({ studyId: current.source.study_id })}`}
      >
        ← Zur Beobachtungsliste
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Beobachtungsevidenz</h1>
        <p className="mt-2 text-sm text-gray-600">
          {current.source.activity_label} ·{" "}
          {current.source.observed_at.toISOString()} · Revision{" "}
          {current.revision}
        </p>
        <p className="mt-1 break-all text-xs text-gray-500">{observationId}</p>
      </div>
      {saved && (
        <p
          role="status"
          className="rounded bg-green-50 p-3 text-sm text-green-800"
        >
          Evidenzrevision gespeichert.
        </p>
      )}
      {current.legacy.memo.text && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-medium">Gemeinsame Stationsnotiz</p>
          <p className="mt-1 whitespace-pre-wrap">{current.legacy.memo.text}</p>
          <p className="mt-2 text-xs">
            Diese Notiz gehört zum Rundgang und wird dieser Einzelbeobachtung
            nicht automatisch zugeordnet.
          </p>
        </div>
      )}
      <EvidenceForm
        key={current.revision}
        input={current.input}
        revision={current.revision}
      />
      <div className="rounded border border-gray-200 bg-white p-5 text-sm">
        <h2 className="font-semibold">AP3-Regelbaseline</h2>
        <p className="mt-2">{result.decision.status}</p>
        <p className="mt-1 text-gray-600">
          Rohscores sind unkalibriert. Eine endgültige Klasse ist noch nicht
          aufgelöst.
        </p>
        {positive.length > 0 && (
          <ul className="mt-3 space-y-1">
            {positive.map((c) => (
              <li key={c.class_id}>
                {c.class_id}: {c.raw_score}
                {c.missing_required_context.length
                  ? ` · Fehlender Kontext: ${c.missing_required_context.join(", ")}`
                  : ""}
              </li>
            ))}
          </ul>
        )}
        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600">
            Diagnose und Audit ansehen
          </summary>
          <pre className="mt-2 max-h-96 overflow-auto rounded bg-gray-50 p-3 text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
      {current.history.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer">
            Gespeicherte Revisionen ({current.history.length})
          </summary>
          <ul className="mt-2 space-y-1">
            {current.history.map((row) => (
              <li key={row.revision}>
                Revision {row.revision} · {row.created_at.toISOString()}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
