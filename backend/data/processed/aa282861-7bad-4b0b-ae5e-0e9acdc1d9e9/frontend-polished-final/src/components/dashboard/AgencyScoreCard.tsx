"use client";

import { AnalyticsResponse } from "@/services/analyticsService";

interface Props {
  analytics: AnalyticsResponse | null;
}

export default function AgencyScoreCard({ analytics }: Props) {
  const score = analytics?.agencyScore ?? 0;
  const improvement = analytics?.improvement ?? 0;

  const message =
    score >= 80
      ? "Excellent progress — your autonomy and learning behaviour are improving steadily."
      : score >= 60
      ? "Good progress — continue learning consistently to improve your agency."
      : "Keep engaging with courses and quizzes to strengthen your learning agency.";

  return (
    <div className="card-dark relative flex h-full flex-col justify-between overflow-hidden p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(238,240,238,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative">
        <p className="eyebrow text-paper-50/40">
          Learning Agency Score
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          <h1 className="font-mono text-6xl font-semibold">
            {score.toFixed(1)}
          </h1>

          <span
            className={`font-mono text-lg ${
              improvement >= 0
                ? "text-thread-300"
                : "text-red-300"
            }`}
          >
            {improvement >= 0 ? "+" : ""}
            {improvement.toFixed(1)}
          </span>
        </div>

        <p className="mt-3 max-w-sm text-[15px] text-paper-50/55">
          {message}
        </p>
      </div>

      <div className="relative mt-8">
        <div className="thread-track bg-paper-50/10">
          <span
            style={{
              width: `${Math.min(Math.max(score, 0), 100)}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between font-mono text-[11px] text-paper-50/35">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}