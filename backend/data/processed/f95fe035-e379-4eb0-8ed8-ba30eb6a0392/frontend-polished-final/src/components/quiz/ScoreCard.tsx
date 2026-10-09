import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  correct: number;
  wrong: number;
  percentage: number;
  passed: boolean;
}

export default function ScoreCard({ correct, wrong, percentage, passed }: Props) {
  return (
    <div className="card-dark relative mx-auto max-w-xl overflow-hidden p-10 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(rgba(238,240,238,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            passed ? "bg-thread-500/20 text-thread-300" : "bg-coral-500/20 text-coral-400"
          }`}
        >
          {passed ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
        </div>

        <p className="eyebrow mt-5 text-paper-50/40">Quiz result</p>
        <h1 className="mt-2 font-mono text-5xl font-semibold">{percentage.toFixed(0)}%</h1>

        <p className={`mt-2 font-mono text-sm uppercase tracking-wide ${passed ? "text-thread-300" : "text-coral-400"}`}>
          {passed ? "Passed" : "Not passed"}
        </p>

        <div className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-4 text-left">
          <div className="rounded-xl border border-paper-50/10 bg-paper-50/[0.04] p-4">
            <p className="eyebrow text-paper-50/35">Correct</p>
            <p className="mt-1 font-mono text-2xl font-semibold">{correct}</p>
          </div>
          <div className="rounded-xl border border-paper-50/10 bg-paper-50/[0.04] p-4">
            <p className="eyebrow text-paper-50/35">Wrong</p>
            <p className="mt-1 font-mono text-2xl font-semibold">{wrong}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
