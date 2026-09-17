"use client";

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from "recharts";

const GRUPPE_COLORS: Record<string, string> = {
  HT: "#16a34a",
  NT: "#ea580c",
  VS: "#dc2626",
  FK: "#6b7280",
};

interface DataPoint {
  gruppe: string;
  label: string;
  actual: number; // 0..100 pct
  target: number; // 0..100 pct
}

interface Props {
  data: DataPoint[];
}

interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
  target?: number;
}

function DeviationLabel({ x = 0, y = 0, width = 0, value = 0, target = 0 }: CustomLabelProps) {
  const deviation = Math.round(value - target);
  if (deviation === 0) return null;
  const sign = deviation > 0 ? "+" : "";
  return (
    <text
      x={x + width / 2}
      y={y - 4}
      fill={deviation > 0 ? "#16a34a" : "#dc2626"}
      textAnchor="middle"
      fontSize={11}
      fontWeight="bold"
    >
      {sign}{deviation} pp
    </text>
  );
}

export default function BarChartComponent({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Keine Daten
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReBarChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="gruppe"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any, name: any) => [`${Math.round(Number(value))} %`, name]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          labelFormatter={(label: any) => {
            const d = data.find((x) => x.gruppe === String(label));
            return d?.label ?? String(label);
          }}
        />
        <Bar dataKey="actual" name="Istwert" radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={GRUPPE_COLORS[entry.gruppe] ?? "#94a3b8"} />
          ))}
        </Bar>
        {/* Reference lines for targets */}
        {data.map((entry, index) => (
          <ReferenceLine
            key={index}
            x={entry.gruppe}
            y={entry.target}
            stroke={GRUPPE_COLORS[entry.gruppe] ?? "#94a3b8"}
            strokeDasharray="4 2"
            strokeWidth={2}
            label={{ value: `${Math.round(entry.target)}%`, position: "insideTopRight", fontSize: 10 }}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
}
