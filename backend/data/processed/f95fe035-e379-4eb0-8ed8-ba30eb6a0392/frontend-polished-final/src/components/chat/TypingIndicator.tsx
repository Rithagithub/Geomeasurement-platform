export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-ink-400">
      <div className="h-2 w-2 animate-bounce rounded-full bg-thread-500" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-thread-500 delay-150" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-thread-500 delay-300" />
      <span className="ml-2">AI is thinking…</span>
    </div>
  );
}
