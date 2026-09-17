interface StatusPillProps {
  status: "planned" | "conducted" | "partial";
}

export function StatusPill({ status }: StatusPillProps) {
  const map = {
    planned: { label: "Geplant", cls: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    conducted: { label: "Durchgeführt", cls: "bg-green-100 text-green-800 border-green-300" },
    partial: { label: "Teilweise", cls: "bg-orange-100 text-orange-800 border-orange-300" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {label}
    </span>
  );
}
