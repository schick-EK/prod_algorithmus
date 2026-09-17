"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GRUPPE_COLORS: Record<string, string> = {
  HT: "#16a34a",
  NT: "#ea580c",
  VS: "#dc2626",
  FK: "#6b7280",
};

interface DataPoint {
  name: string;
  gruppe: string;
  value: number;
  label: string;
}

interface GruppeTotal {
  gruppe: string;
  value: number;
}

interface Props {
  data: DataPoint[];
}

function formatPct(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

const RADIAN = Math.PI / 180;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomLabel(props: any) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, value = 0, total } = props;
  const pct = Math.round((value / total) * 100);
  if (pct < 5) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="bold"
    >
      {pct}%
    </text>
  );
}

export default function DonutChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Inner ring: by gruppe
  const gruppeMap = new Map<string, number>();
  for (const d of data) {
    gruppeMap.set(d.gruppe, (gruppeMap.get(d.gruppe) ?? 0) + d.value);
  }
  const innerData: GruppeTotal[] = Array.from(gruppeMap.entries()).map(
    ([gruppe, value]) => ({ gruppe, value })
  );

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Keine Daten
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        {/* Inner ring: gruppe */}
        <Pie
          data={innerData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          dataKey="value"
          nameKey="gruppe"
          labelLine={false}
          label={(props) => renderCustomLabel({ ...props, total })}
        >
          {innerData.map((entry, index) => (
            <Cell
              key={`inner-${index}`}
              fill={GRUPPE_COLORS[entry.gruppe] ?? "#94a3b8"}
            />
          ))}
        </Pie>

        {/* Outer ring: individual activities */}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={95}
          outerRadius={130}
          dataKey="value"
          nameKey="label"
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`outer-${index}`}
              fill={GRUPPE_COLORS[entry.gruppe] ?? "#94a3b8"}
              opacity={0.7}
            />
          ))}
        </Pie>

        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [
            `${value} (${formatPct(Number(value), total)})`,
            "Beobachtungen",
          ]}
        />
        <Legend
          content={() => {
            return (
              <ul className="flex flex-wrap gap-2 justify-center text-xs mt-2">
                {innerData.map((d) => (
                  <li key={d.gruppe} className="flex items-center gap-1">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ background: GRUPPE_COLORS[d.gruppe] }}
                    />
                    {d.gruppe} ({formatPct(d.value, total)})
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
