import { Progress } from "@/types/progress";

interface Props {
  progress: Progress;
}

export default function ProgressCard({ progress }: Props) {
  const done = progress.completion === 100;

  return (
    <div className="card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lifted">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {progress.courseTitle}
          </h2>

          <p className="mt-2 text-sm text-ink-400">
            Lessons {progress.completedLessons} / {progress.totalLessons} &middot;{" "}
            <span className="font-mono">{progress.hoursSpent}h</span> spent
          </p>
        </div>

        <div className="text-right">
          <div className="font-mono text-3xl font-semibold text-ink-900">
            {progress.completion}%
          </div>

          <span className={`badge mt-2 ${done ? "border-thread-500/30 text-thread-700" : "border-signal-500/30 text-signal-700"}`}>
            {done ? "Completed" : "In progress"}
          </span>
        </div>
      </div>

      <div className="thread-track mt-6">
        <span style={{ width: `${progress.completion}%` }} />
      </div>
    </div>
  );
}
