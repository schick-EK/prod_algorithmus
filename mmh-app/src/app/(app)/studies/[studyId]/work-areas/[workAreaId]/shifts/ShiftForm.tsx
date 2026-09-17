"use client";

import { useState } from "react";
import { createShift } from "./actions";

const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
  { value: 7, label: "So" },
];

interface Break {
  start: string;
  end: string;
}

interface Props {
  workAreaId: string;
  studyId: string;
}

export default function ShiftForm({ workAreaId, studyId }: Props) {
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [pending, setPending] = useState(false);

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  }

  function addBreak() {
    setBreaks((prev) => [...prev, { start: "12:00", end: "12:30" }]);
  }

  function removeBreak(i: number) {
    setBreaks((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateBreak(i: number, field: keyof Break, value: string) {
    setBreaks((prev) =>
      prev.map((b, idx) => (idx === i ? { ...b, [field]: value } : b))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    // Append weekdays manually
    selectedDays.forEach((d) => form.append("weekdays", String(d)));
    // Append breaks as JSON
    form.set("breaks", JSON.stringify(breaks));
    try {
      await createShift(workAreaId, studyId, form);
      (e.target as HTMLFormElement).reset();
      setBreaks([]);
      setSelectedDays([1, 2, 3, 4, 5]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 max-w-xl">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Schicht hinzufügen</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name (optional)</label>
            <input
              name="name"
              type="text"
              placeholder="z.B. Frühschicht"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Beginn *</label>
            <input
              name="start_time"
              type="text"
              required
              placeholder="06:00"
              pattern="\d{1,2}:\d{2}"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ende *</label>
            <input
              name="end_time"
              type="text"
              required
              placeholder="14:00"
              pattern="\d{1,2}:\d{2}"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Weekdays */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Wochentage</label>
          <div className="flex gap-1">
            {WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                  selectedDays.includes(d.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breaks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-gray-500">Pausen</label>
            <button
              type="button"
              onClick={addBreak}
              className="text-xs text-blue-600 hover:underline"
            >
              + Pause hinzufügen
            </button>
          </div>
          {breaks.map((brk, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={brk.start}
                onChange={(e) => updateBreak(i, "start", e.target.value)}
                placeholder="12:00"
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <span className="text-gray-400 text-sm">–</span>
              <input
                type="text"
                value={brk.end}
                onChange={(e) => updateBreak(i, "end", e.target.value)}
                placeholder="12:30"
                className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => removeBreak(i)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Speichern..." : "Schicht anlegen"}
        </button>
      </form>
    </div>
  );
}
