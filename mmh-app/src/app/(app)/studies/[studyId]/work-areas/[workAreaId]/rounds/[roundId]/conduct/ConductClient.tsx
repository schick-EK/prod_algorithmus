"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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

type RoundState = {
  s: Record<
    string,
    {
      c?: Record<string, number>;
      n?: string;
      nc?: boolean;
    }
  >;
};

interface Props {
  stations: Station[];
  workAreaId: string;
  studyId: string;
  roundId: string;
}

const GRUPPE_COLORS: Record<string, string> = {
  HT: "bg-green-100 text-green-800 border-green-300",
  NT: "bg-orange-100 text-orange-800 border-orange-300",
  VS: "bg-red-100 text-red-800 border-red-300",
  FK: "bg-gray-100 text-gray-700 border-gray-300",
};

function getExpected(station: Station): number {
  if (station.category === "Maschine") return 1;
  return Math.max(1, station.employee_count ?? 1);
}

function getStationSum(counts: Record<string, number> = {}): number {
  return Object.values(counts).reduce((sum, c) => sum + c, 0);
}

type StationStatus = "not_started" | "partial" | "complete";

function getStatus(station: Station, state: RoundState): StationStatus {
  const st = state.s[station.id];
  const sum = getStationSum(st?.c);
  const expected = getExpected(station);
  if (sum === 0) return "not_started";
  if (sum >= expected) return "complete";
  return "partial";
}

const STORAGE_KEY_PREFIX = "round-draft";

export default function ConductClient({
  stations,
  workAreaId,
  studyId,
  roundId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storageKey = `${STORAGE_KEY_PREFIX}:${workAreaId}:${roundId}`;

  // Read initial state from URL or localStorage via lazy initializer
  // This runs only on the client (no SSR for this component)
  const rParamInitial = searchParams.get("r");

  const [state, setState] = useState<RoundState>(() => {
    // Try URL param first
    if (rParamInitial) {
      try {
        return JSON.parse(decodeURIComponent(rParamInitial));
      } catch {}
    }
    // Try localStorage (safe: useState lazy init runs client-side)
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { s: {} };
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave to localStorage and sync URL
  const persistState = useCallback(
    (newState: RoundState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaveStatus("saving");
      debounceRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newState));
          // Update URL param without pushing to history
          const encoded = encodeURIComponent(JSON.stringify(newState));
          const url = new URL(window.location.href);
          url.searchParams.set("r", encoded);
          window.history.replaceState(null, "", url.toString());
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      }, 400);
    },
    [storageKey]
  );

  function setCount(stationId: string, activityId: string, delta: number) {
    setState((prev) => {
      const stationState = prev.s[stationId] ?? {};
      const counts = { ...(stationState.c ?? {}) };
      counts[activityId] = Math.max(0, (counts[activityId] ?? 0) + delta);
      const newState: RoundState = {
        ...prev,
        s: {
          ...prev.s,
          [stationId]: {
            ...stationState,
            c: counts,
          },
        },
      };
      persistState(newState);
      return newState;
    });
  }

  function setNote(stationId: string, note: string) {
    setState((prev) => {
      const newState: RoundState = {
        ...prev,
        s: {
          ...prev.s,
          [stationId]: {
            ...(prev.s[stationId] ?? {}),
            n: note,
          },
        },
      };
      persistState(newState);
      return newState;
    });
  }

  function setNoAnomalies(stationId: string, checked: boolean) {
    setState((prev) => {
      const newState: RoundState = {
        ...prev,
        s: {
          ...prev.s,
          [stationId]: {
            ...(prev.s[stationId] ?? {}),
            nc: checked,
          },
        },
      };
      persistState(newState);
      return newState;
    });
  }

  // Progress calculation
  const completedUnits = stations.reduce((sum, st) => {
    const stState = state.s[st.id];
    const total = getStationSum(stState?.c);
    return sum + Math.min(total, getExpected(st));
  }, 0);
  const totalExpected = stations.reduce((sum, st) => sum + getExpected(st), 0);
  const progress = totalExpected > 0 ? (completedUnits / totalExpected) * 100 : 0;

  const currentStation = stations[currentIdx];

  function goToReview() {
    const encoded = encodeURIComponent(JSON.stringify(state));
    router.push(
      `/studies/${studyId}/work-areas/${workAreaId}/rounds/${roundId}/review?r=${encoded}`
    );
  }

  if (!currentStation) {
    return <div className="text-gray-500">Keine Stationen vorhanden.</div>;
  }

  const stationState = state.s[currentStation.id] ?? {};
  const counts = stationState.c ?? {};
  const expected = getExpected(currentStation);
  const currentSum = getStationSum(counts);

  return (
    <div className="flex gap-6">
      {/* Left: Station list */}
      <div className="w-48 shrink-0">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Stationen
        </p>
        <div className="space-y-1">
          {stations.map((st, idx) => {
            const status = getStatus(st, state);
            return (
              <button
                key={st.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                  idx === currentIdx
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    status === "complete"
                      ? "bg-green-500"
                      : status === "partial"
                      ? "bg-yellow-400"
                      : "bg-gray-300"
                  }`}
                />
                <span className="truncate">{st.name}</span>
                {status === "complete" && (
                  <span className="text-green-500 text-xs ml-auto">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Main content */}
      <div className="flex-1 min-w-0">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Fortschritt</span>
            <span>
              {completedUnits} / {totalExpected} Einheiten ({Math.round(progress)} %)
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Station card */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {currentStation.name}
              </h2>
              <p className="text-sm text-gray-500">
                {currentStation.category === "Mitarbeiter"
                  ? `${currentStation.employee_count ?? 1} Mitarbeiter`
                  : "Maschine"}{" "}
                · Erwartet: {expected} Einheit{expected !== 1 ? "en" : ""}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                currentSum >= expected
                  ? "bg-green-100 text-green-700"
                  : currentSum > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {currentSum}/{expected}
            </span>
          </div>

          {/* Activities */}
          <div className="space-y-2 mb-5">
            {currentStation.activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${GRUPPE_COLORS[act.gruppe]}`}
                >
                  {act.gruppe}
                </span>
                <span className="flex-1 text-sm text-gray-800">{act.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCount(currentStation.id, act.id, -1)}
                    disabled={!counts[act.id]}
                    className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-30 flex items-center justify-center font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">
                    {counts[act.id] ?? 0}
                  </span>
                  <button
                    onClick={() => setCount(currentStation.id, act.id, 1)}
                    className="w-8 h-8 rounded-full border border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Notiz
            </label>
            <textarea
              value={stationState.n ?? ""}
              onChange={(e) => setNote(currentStation.id, e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auffälligkeiten, Beobachtungen..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stationState.nc ?? false}
              onChange={(e) =>
                setNoAnomalies(currentStation.id, e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Keine Auffälligkeiten</span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            ← Vorherige Station
          </button>

          <div className="flex items-center gap-3">
            {/* Save status */}
            <span
              className={`text-xs px-2 py-1 rounded ${
                saveStatus === "saved"
                  ? "bg-green-50 text-green-600"
                  : saveStatus === "saving"
                  ? "bg-yellow-50 text-yellow-600"
                  : saveStatus === "error"
                  ? "bg-red-50 text-red-600"
                  : ""
              }`}
            >
              {saveStatus === "saved"
                ? "Gespeichert"
                : saveStatus === "saving"
                ? "Speichern..."
                : saveStatus === "error"
                ? "Fehler"
                : ""}
            </span>

            <button
              onClick={goToReview}
              className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Zur Übersicht →
            </button>
          </div>

          <button
            onClick={() =>
              setCurrentIdx((i) => Math.min(stations.length - 1, i + 1))
            }
            disabled={currentIdx === stations.length - 1}
            className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Nächste Station →
          </button>
        </div>

        <div className="mt-3 text-center">
          <Link
            href={`/studies/${studyId}/work-areas/${workAreaId}/rounds`}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Rundgang abbrechen
          </Link>
        </div>
      </div>
    </div>
  );
}
