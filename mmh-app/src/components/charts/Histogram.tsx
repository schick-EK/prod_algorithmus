"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  observations: { observed_at: string }[];
  timezone: string;
}

export default function Histogram({ observations, timezone }: Props) {
  // Build hourly buckets 0-23
  const buckets = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    label: `${String(h).padStart(2, "0")}`,
    count: 0,
  }));

  for (const obs of observations) {
    try {
      const d = new Date(obs.observed_at);
      const hourStr = new Intl.DateTimeFormat("de-DE", {
        timeZone: timezone,
        hour: "2-digit",
        hour12: false,
      }).format(d);
      const h = parseInt(hourStr);
      if (h >= 0 && h < 24) {
        buckets[h].count++;
      }
    } catch {}
  }

  if (observations.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Keine Daten
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={buckets} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10 }}
          tickLine={false}
          interval={2}
        />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [value, "Beobachtungen"]}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
