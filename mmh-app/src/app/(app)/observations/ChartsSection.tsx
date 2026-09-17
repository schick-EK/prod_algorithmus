"use client";

import dynamic from "next/dynamic";

const DonutChart = dynamic(() => import("@/components/charts/DonutChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Laden...
    </div>
  ),
});

const BarChartComponent = dynamic(
  () => import("@/components/charts/BarChart"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Laden...
      </div>
    ),
  }
);

const Histogram = dynamic(() => import("@/components/charts/Histogram"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
      Laden...
    </div>
  ),
});

interface DonutDataPoint {
  name: string;
  gruppe: string;
  value: number;
  label: string;
}

interface BarDataPoint {
  gruppe: string;
  label: string;
  actual: number;
  target: number;
}

interface Props {
  donutData: DonutDataPoint[];
  barData: BarDataPoint[];
  histObservations: { observed_at: string }[];
  timezone: string;
}

export default function ChartsSection({
  donutData,
  barData,
  histObservations,
  timezone,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Verteilung nach Gruppe
        </h2>
        <DonutChart data={donutData} />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Ist vs. Soll
        </h2>
        <BarChartComponent data={barData} />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-5 col-span-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Beobachtungen nach Uhrzeit
        </h2>
        <Histogram observations={histObservations} timezone={timezone} />
      </div>
    </div>
  );
}
