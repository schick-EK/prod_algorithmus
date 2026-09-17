import Link from "next/link";
import { createStudy } from "../actions";

export default function NewStudyPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neue Studie anlegen</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-xl">
        <form action={createStudy} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bezeichnung *
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="z.B. Studie Werk A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse / Standort
            </label>
            <input
              name="address"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="z.B. Musterstraße 1, 12345 Berlin"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Startdatum
              </label>
              <input
                name="start_date"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enddatum
              </label>
              <input
                name="end_date"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zeitzone
            </label>
            <select
              name="timezone"
              defaultValue="Europe/Berlin"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Europe/Berlin">Europe/Berlin (MEZ/MESZ)</option>
              <option value="Europe/London">Europe/London</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfidenzniveau
            </label>
            <select
              name="confidence_level"
              defaultValue="95"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="90">90 %</option>
              <option value="95">95 % (Standard)</option>
              <option value="98">98 %</option>
              <option value="99">99 %</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Studie anlegen
            </button>
            <Link
              href="/studies"
              className="px-5 py-2 rounded text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
