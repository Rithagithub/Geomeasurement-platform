import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "signal" | "thread" | "coral";
}

const ACCENTS: Record<string, string> = {
  signal: "bg-signal-500/15 text-signal-700",
  thread: "bg-thread-500/15 text-thread-700",
  coral: "bg-coral-500/15 text-coral-600",
};

export default function StatCard({ title, value, icon: Icon, accent = "thread" }: StatCardProps) {
  return (
    <div className="card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lifted">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
        <Icon size={18} />
      </div>

      <h3 className="eyebrow mt-5 text-ink-400">{title}</h3>

      <p className="mt-1 font-mono text-3xl font-semibold text-ink-900">{value}</p>
    </div>
  );
}
