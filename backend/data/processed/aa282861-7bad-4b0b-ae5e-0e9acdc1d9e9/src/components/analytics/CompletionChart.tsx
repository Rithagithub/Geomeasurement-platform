"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import { AnalyticsResponse } from "@/services/analyticsService";

interface Props {
  analytics: AnalyticsResponse;
}

const COLORS = ["#2F8F7C", "#E7A33E"];

export default function CompletionChart({ analytics }: Props) {
  const data = [
    { name: "Completed", value: analytics.completedCourses },
    { name: "In progress", value: analytics.inProgressCourses },
  ];

  return (
    <div className="card p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink-900">Course completion</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(18,21,28,0.08)", fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 13, fontFamily: "var(--font-body)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
