import { db } from "@/db";
import { studies } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { formatDate } from "@/lib/format";

export default async function StudiesPage() {
  const userStudies = await db
    .select()
    .from(studies)
    .orderBy(desc(studies.created_at));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meine Studien</h1>
        <Link
          href="/studies/new"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Neue Studie
        </Link>
      </div>

      {userStudies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">Keine Studien vorhanden.</p>
          <Link
            href="/studies/new"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Erste Studie anlegen
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {userStudies.map((study) => (
            <Link
              key={study.id}
              href={`/studies/${study.id}`}
              className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{study.name}</h2>
                  {study.address && (
                    <p className="text-sm text-gray-500 mt-0.5">{study.address}</p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>Erstellt: {formatDate(study.created_at)}</p>
                  {study.start_date && (
                    <p>
                      {study.start_date} – {study.end_date || "offen"}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
