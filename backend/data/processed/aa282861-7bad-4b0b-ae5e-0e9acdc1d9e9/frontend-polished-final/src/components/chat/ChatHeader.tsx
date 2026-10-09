import { Bot } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-ink-900/[0.06] bg-paper-50 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-signal-500">
        <Bot size={16} />
      </div>
      <div>
        <h2 className="font-display text-xl font-semibold text-ink-900">AI Learning Assistant</h2>
        <p className="text-sm text-ink-400">Adaptive tutoring, tuned to your progress.</p>
      </div>
    </div>
  );
}
