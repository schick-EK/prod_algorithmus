import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MMH - Multimomentaufnahme",
  description: "Multimomentaufnahme (MMH) Erfassungssystem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="h-full">
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
