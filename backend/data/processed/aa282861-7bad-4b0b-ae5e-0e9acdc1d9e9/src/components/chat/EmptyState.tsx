import SuggestedPrompts from "./SuggestedPrompts";

interface Props {
  onPrompt: (prompt: string) => Promise<void>;
}

export default function EmptyState({ onPrompt }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12">
      <span className="node-dot" />
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink-900">AI Tutor</h1>
      <p className="mt-3 text-ink-400">Ask anything, or start from a prompt below.</p>

      <div className="mt-10 w-full max-w-3xl">
        <SuggestedPrompts onSelect={onPrompt} />
      </div>
    </div>
  );
}
