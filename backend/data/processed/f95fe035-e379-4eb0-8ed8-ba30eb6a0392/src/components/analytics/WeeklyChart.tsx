"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const weeklyData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 3.5 },
];

export default function WeeklyChart() {
  return (
    <div className="card p-6">
      <h2 className="mb-6 font-display text-xl font-semibold text-ink-900">Weekly learning hours</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weeklyData}>
          <CartesianGrid stroke="#12151C" strokeOpacity={0.06} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#666D68" }} axisLine={{ stroke: "#12151C", strokeOpacity: 0.1 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#666D68" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(18,21,28,0.08)", fontSize: 13 }} />
          <Line type="monotone" dataKey="hours" strokeWidth={2.5} stroke="#2F8F7C" dot={{ r: 4, fill: "#2F8F7C" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
