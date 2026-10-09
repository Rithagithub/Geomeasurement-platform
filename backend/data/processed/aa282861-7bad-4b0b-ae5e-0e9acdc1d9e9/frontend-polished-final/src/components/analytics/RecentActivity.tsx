"use client";

import { CheckCircle2 } from "lucide-react";

interface Activity {
  title: string;
  time: string;
}

const activities: Activity[] = [
  { title: "Completed Java Basics", time: "Today" },
  { title: "Passed quiz — Spring Boot", time: "Yesterday" },
  { title: "Earned certificate", time: "2 days ago" },
  { title: "Started React course", time: "3 days ago" },
];

export default function RecentActivity() {
  return (
    <div className="card p-6">
      <h2 className="mb-5 font-display text-xl font-semibold text-ink-900">Recent activity</h2>

      <div className="space-y-1">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-t border-ink-900/[0.06] py-3 first:border-t-0"
          >
            <div>
              <p className="text-sm font-medium text-ink-800">{activity.title}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-300">{activity.time}</p>
            </div>

            <CheckCircle2 size={18} className="text-thread-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
