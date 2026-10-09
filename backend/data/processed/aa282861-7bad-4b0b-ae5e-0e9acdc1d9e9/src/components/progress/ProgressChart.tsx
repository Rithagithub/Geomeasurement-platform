"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Progress } from "@/types/progress";

interface Props {
  progress: Progress[];
}

export default function ProgressChart({ progress }: Props) {
  return (
    <div className="card h-96 p-6">
      <h2 className="mb-4 font-display text-xl font-semibold text-ink-900">Completion by course</h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={progress}>
          <CartesianGrid stroke="#12151C" strokeOpacity={0.06} vertical={false} />
          <XAxis
            dataKey="courseTitle"
            tick={{ fontSize: 11, fill: "#666D68", fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "#12151C", strokeOpacity: 0.1 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#666D68", fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#12151C", fillOpacity: 0.04 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(18,21,28,0.08)",
              fontFamily: "var(--font-body)",
              fontSize: 13,
            }}
          />
          <Bar dataKey="completion" fill="#2F8F7C" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
