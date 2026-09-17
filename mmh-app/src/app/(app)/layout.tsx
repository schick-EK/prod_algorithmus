import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200">
          <span className="text-lg font-bold text-blue-700">MMH</span>
          <span className="ml-1 text-sm text-gray-500">Multimomentaufnahme</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/studies"
            className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100 font-medium"
          >
            Studien
          </Link>
          <Link
            href="/observations"
            className="block px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100 font-medium"
          >
            Auswertung
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
