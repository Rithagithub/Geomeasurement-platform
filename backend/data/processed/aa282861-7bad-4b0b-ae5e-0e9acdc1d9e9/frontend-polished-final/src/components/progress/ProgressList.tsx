import { Progress } from "@/types/progress";

interface Props {
  progress: Progress[];
}

export default function ProgressList({ progress }: Props) {
  return (
    <div className="card p-6">
      <h2 className="mb-5 font-display text-xl font-semibold text-ink-900">Learning progress</h2>

      <div className="space-y-5">
        {progress.map((item) => (
          <div key={item.courseId}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-ink-700">{item.courseTitle}</span>
              <span className="font-mono text-ink-400">{item.completion}%</span>
            </div>

            <div className="thread-track">
              <span style={{ width: `${item.completion}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
