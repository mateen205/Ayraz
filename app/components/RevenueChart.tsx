"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  labels: string[];
  data: number[];
};

export default function RevenueChart({ labels, data }: Props) {
  return (
    <div className="bg-zinc-900 rounded-3xl p-6">
      <h2 className="text-2xl font-bold mb-6">
        Revenue Growth
      </h2>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Revenue (PKR)",
              data,
              fill: true,
              borderWidth: 3,
              tension: 0.35,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderColor: "#ffffff",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                color: "#aaa",
              },
              grid: {
                color: "#222",
              },
            },
            y: {
              ticks: {
                color: "#aaa",
              },
              grid: {
                color: "#222",
              },
            },
          },
        }}
      />
    </div>
  );
}