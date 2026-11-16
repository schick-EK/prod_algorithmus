"use client";

import { useActionState, useState } from "react";
import {
  AnnotationInput,
  Feature,
  FEATURES,
  FEATURE_VALUES,
} from "@/lib/annotation/contracts";
import { saveEvidence } from "./actions";

const FEATURE_LABELS: Record<Feature, string> = {
  machine_status: "Maschinenstatus",
  operator_activity: "Personenaktivität",
  material_status: "Materialstatus",
};
const LABELS: Record<string, string> = {
  running: "Läuft",
  stopped: "Steht",
  changing_state: "Zustandswechsel",
  not_visible: "Nicht sichtbar",
  unknown: "Unbekannt",
  processing: "Bearbeitet",
  waiting: "Wartet",
  moving: "Bewegt sich",
  transporting: "Transportiert",
  searching: "Sucht",
  inspecting: "Prüft",
  working_on_equipment: "Arbeitet am Betriebsmittel",
  communicating: "Kommuniziert",
  unclear: "Unklar",
  available: "Verfügbar",
  not_available: "Nicht verfügbar",
  not_observed: "Nicht beobachtet",
  not_known: "Nicht bekannt",
  not_applicable: "Nicht anwendbar",
  capture_failed: "Erfassung fehlgeschlagen",
};
const control =
  "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm";

export default function EvidenceForm({
  input,
  revision,
}: {
  input: AnnotationInput;
  revision: number;
}) {
  const [state, action, pending] = useActionState(saveEvidence, {
    error: null,
  });
  const [features, setFeatures] = useState(input.structured_features);
  const [missingness, setMissingness] = useState(input.missingness);
  const individual = input.memo.scope === "observation";
  const [memoStatus, setMemoStatus] = useState(
    individual ? input.memo.status : "not_recorded",
  );
  const [memoText, setMemoText] = useState(
    individual ? (input.memo.text ?? "") : "",
  );
  const [quality, setQuality] = useState(input.observation_quality.level ?? "");
  const [processStep, setProcessStep] = useState(
    input.context.process_step_id ?? "",
  );
  return (
    <form
      action={action}
      className="space-y-5 rounded-lg border border-gray-200 bg-white p-5"
    >
      <input type="hidden" name="observation_id" value={input.observation_id} />
      <input type="hidden" name="expected_revision" value={revision} />
      <div className="grid gap-5 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature}>
            <label className="block text-sm font-medium">
              {FEATURE_LABELS[feature]}
              <select
                aria-label={FEATURE_LABELS[feature]}
                className={control}
                name={feature}
                value={features[feature] ?? ""}
                onChange={(e) =>
                  setFeatures((previous) => ({
                    ...previous,
                    [feature]: e.target.value || null,
                  }))
                }
              >
                <option value="">Nicht erfasst</option>
                {FEATURE_VALUES[feature].map((value) => (
                  <option key={value} value={value}>
                    {LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
            {!features[feature] && (
              <label className="mt-2 block text-xs text-gray-600">
                Grund für fehlenden Wert
                <select
                  aria-label={`Grund für fehlenden Wert: ${FEATURE_LABELS[feature]}`}
                  className={control}
                  name={`missingness_${feature}`}
                  value={
                    missingness[feature] === "present"
                      ? "not_observed"
                      : missingness[feature]
                  }
                  onChange={(e) =>
                    setMissingness((previous) => ({
                      ...previous,
                      [feature]: e.target.value,
                    }))
                  }
                >
                  {[
                    "not_observed",
                    "not_known",
                    "not_applicable",
                    "capture_failed",
                  ].map((value) => (
                    <option key={value} value={value}>
                      {LABELS[value]}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">
          Beobachtungsqualität
          <select
            aria-label="Beobachtungsqualität"
            name="quality"
            className={control}
            value={quality}
            onChange={(e) => setQuality(e.target.value as typeof quality)}
          >
            <option value="">Nicht erfasst</option>
            <option value="high">Hoch</option>
            <option value="medium">Mittel</option>
            <option value="low">Niedrig</option>
            <option value="not_observable">Nicht beobachtbar</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Prozessschritt (falls bekannt)
          <input
            aria-label="Prozessschritt (falls bekannt)"
            name="process_step_id"
            className={control}
            value={processStep}
            onChange={(e) => setProcessStep(e.target.value)}
          />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Status des individuellen Textmemos
        <select
          aria-label="Status des individuellen Textmemos"
          name="memo_status"
          className={control}
          value={memoStatus}
          onChange={(e) => setMemoStatus(e.target.value as typeof memoStatus)}
        >
          <option value="not_recorded">Nicht erfasst</option>
          <option value="available">Vorhanden</option>
          <option value="capture_failed">Erfassung fehlgeschlagen</option>
        </select>
      </label>
      <label className="block text-sm font-medium">
        Textmemo zu dieser Beobachtung
        <textarea
          aria-label="Textmemo zu dieser Beobachtung"
          name="memo_text"
          className={control}
          rows={3}
          maxLength={10000}
          value={memoText}
          onChange={(e) => {
            setMemoText(e.target.value);
            if (e.target.value.trim()) setMemoStatus("available");
          }}
          placeholder="Nur Aussagen zu dieser einzelnen Beobachtung eintragen."
        />
      </label>
      <p className="text-xs text-gray-500">
        Die Eingabe ergänzt die ursprüngliche Beobachtung als neue Revision. AP3
        prüft sie weiterhin als fehlerbehaftete Evidenz.
      </p>
      {state.error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Wird gespeichert …" : "Neue Evidenzrevision speichern"}
      </button>
    </form>
  );
}
