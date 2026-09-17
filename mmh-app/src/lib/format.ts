export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function padCode(n: number): string {
  return String(n).padStart(5, "0");
}

export function gruppeLabel(g: string): string {
  return (
    {
      HT: "Haupttätigkeit",
      NT: "Nebentätigkeit",
      VS: "Verschwendung",
      FK: "Freie Kapazität",
    }[g] ?? g
  );
}

export function parseTime(raw: string): string {
  raw = raw.trim().replace(",", ".");
  if (!raw.includes(":")) raw = raw + ":00";
  const [h, m] = raw.split(":");
  return (
    String(parseInt(h)).padStart(2, "0") +
    ":" +
    String(parseInt(m || "0")).padStart(2, "0")
  );
}
