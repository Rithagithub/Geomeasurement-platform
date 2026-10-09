"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { AnalyticsResponse } from "@/services/analyticsService";

interface Props {
  analytics: AnalyticsResponse;
}

export default function QuizChart({ analytics }: Props) {
  const data = [
    {
      name: "Improvement",
      value: analytics.improvement,
    },
    {
      name: "Agency Index",
      value: analytics.agencyPreservationIndex,
    },
    {
      name: "Learning Betweenness",
      value: analytics.dynamicLearningBetweenness,
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink-900">
        Learning Performance
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid
            stroke="#12151C"
            strokeOpacity={0.06}
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#666D68" }}
            axisLine={{ stroke: "#12151C", strokeOpacity: 0.1 }}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#666D68" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "#12151C", fillOpacity: 0.04 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(18,21,28,0.08)",
              fontSize: 13,
            }}
          />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="#E7A33E"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}