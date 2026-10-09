"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { AnalyticsResponse } from "@/services/analyticsService";

interface Props {
  analytics: AnalyticsResponse;
}

const COLORS = ["#2F8F7C", "#E7A33E", "#5B7FFF"];

export default function CompletionChart({ analytics }: Props) {
  const data = [
    {
      name: "Agency Score",
      value: analytics.agencyScore,
    },
    {
      name: "AI Dependency",
      value: analytics.aiDependency,
    },
    {
      name: "Collaboration",
      value: analytics.collaborationScore,
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink-900">
        Learning Agency Distribution
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}