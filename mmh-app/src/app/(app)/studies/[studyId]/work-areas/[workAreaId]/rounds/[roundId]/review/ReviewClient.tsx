"use client";

import { useState } from "react";
import { saveRound, type RoundState } from "../actions";

type ActivityType = {
  id: string;
  label: string;
  gruppe: "HT" | "NT" | "VS" | "FK";
};

type Station = {
  id: string;
  name: string;
  category: "Mitarbeiter" | "Maschine";
  employee_count: number | null;
  activities: ActivityType[];
};

interface Props {
  stations: Station[];
  roundState: RoundState;
  workAreaId: string;
  studyId: string;
  roundId: string;
}

function getExpected(station: Station): number {
  if (station.category === "Maschine") return 1;
  return Math.max(1, station.employee_count ?? 1);
}

function getStationSum(counts: Record<string, number> = {}): number {
  return Object.values(counts).reduce((sum, c) => sum + c, 0);
}

const GRUPPE_COLORS: Record<string, string> = {
  HT: "bg-green-100 text-green-800 border-green-300",
  NT: "bg-orange-100 text-orange-800 border-orange-300",
  VS: "bg-red-100 text-red-800 border-red-300",
  FK: "bg-gray-100 text-gray-700 border-gray-300",
};

export default function ReviewClient({
  stations,
  roundState,
  workAreaId,
  studyId,
  roundId,
}: Props) {
  const [saving, setSaving] = useState(false);

  // Validate all stations
  const validationErrors: Record<string, string> = {};
  for (const station of stations) {
    const stationState = roundState.s[station.id] ?? {};
    const sum = getStationSum(stationState.c);
    const expected = getExpected(station);
    const hasNote = !!(stationState.n && stationState.n.trim());
    const hasNc = !!stationState.nc;

    if (sum !== expected) {
      // Count mismatch: note is MANDATORY
      if (!hasNote) {
        validationErrors[station.id] =
          `Anzahl (${sum}) weicht von Erwartung (${expected}) ab – Notiz erforderlich.`;
      }
    } else {
      // Count matches: must have either nc=true or a note
      if (!hasNc && !hasNote) {
        validationErrors[station.id] =
          'Bitte "Keine Auffälligkeiten" bestätigen oder eine Notiz hinterlassen.';
      }
    }
  }

  const isValid = Object.keys(validationErrors).length === 0;

  async function handleSave() {
    if (!isValid) return;
    setSaving(true);
    try {
      await saveRound(roundId, roundState, workAreaId, studyId);
    } catch {
      // redirect throws, so this only catches real errors
      setSaving(false);
      alert("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
    }
  }

  return (
    <div>
      {!isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-red-700 mb-2">
            Bitte beheben Sie folgende Probleme:
          </p>
          <ul className="space-y-1">
            {Object.entries(validationErrors).map(([sid, msg]) => {
              const st = stations.find((s) => s.id === sid);
              return (
                <li key={sid} className="text-sm text-red-600">
                  <strong>{st?.name ?? sid}:</strong> {msg}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {stations.map((station) => {
          const stationState = roundState.s[station.id] ?? {};
          const counts = stationState.c ?? {};
          const sum = getStationSum(counts);
          const expected = getExpected(station);
          const hasError = !!validationErrors[station.id];

          return (
            <div
              key={station.id}
              className={`bg-white border rounded-lg p-5 ${
                hasError ? "border-red-300" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{station.name}</h3>
                  <p className="text-xs text-gray-500">
                    {station.category} ·{sum}/{expected} Einheiten
                  </p>
                </div>
                {hasError ? (
                  <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Fehlt
                  </span>
                ) : (
                  <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                    OK ✓
                  </span>
                )}
              </div>

              {/* Activity counts */}
              <div className="space-y-1 mb-3">
                {station.activities
                  .filter((a) => (counts[a.id] ?? 0) > 0)
                  .map((act) => (
                    <div key={act.id} className="flex items-center gap-2 text-sm">
                      <span
                        className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${GRUPPE_COLORS[act.gruppe]}`}
                      >
                        {act.gruppe}
                      </span>
                      <span className="text-gray-700">{act.label}</span>
                      <span className="ml-auto font-medium text-gray-900">
                        {counts[act.id]}×
                      </span>
                    </div>
                  ))}
                {Object.values(counts).every((c) => c === 0) && (
                  <p className="text-xs text-gray-400 italic">
                    Keine Beobachtungen
                  </p>
                )}
              </div>

              {stationState.n && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 mb-2">
                  <span className="font-medium">Notiz:</span> {stationState.n}
                </p>
              )}
              {stationState.nc && (
                <p className="text-xs text-green-600">✓ Keine Auffälligkeiten</p>
              )}
              {hasError && (
                <p className="text-xs text-red-600 mt-2">
                  {validationErrors[station.id]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="bg-green-600 text-white px-6 py-2 rounded font-medium text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Wird gespeichert..." : "Rundgang speichern"}
        </button>
        <a
          href={`/studies/${studyId}/work-areas/${workAreaId}/rounds/${roundId}/conduct`}
          className="px-5 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Zurück zur Erfassung
        </a>
      </div>
    </div>
  );
}
