"use client";

import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage, loading } = useChatStore();

  const handleSend = async () => {
    if (!prompt.trim()) return;

    await sendMessage(prompt);

    setPrompt("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="p-5">
      <div className="mx-auto flex max-w-4xl items-end gap-3">
        <textarea
          ref={textareaRef}
          value={prompt}
          disabled={loading}
          rows={1}
          placeholder="Ask your AI tutor anything…"
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="max-h-40 min-h-[52px] flex-1 resize-none rounded-2xl border border-ink-900/10 bg-paper-50 px-4 py-3 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-300 focus:border-signal-500 focus:ring-2 focus:ring-signal-500/25 disabled:bg-paper-100"
        />

        <button
          disabled={loading || !prompt.trim()}
          onClick={handleSend}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-500 text-ink-950 transition hover:bg-signal-600 disabled:cursor-not-allowed disabled:bg-ink-900/15 disabled:text-ink-300"
        >
          <SendHorizontal size={19} />
        </button>
      </div>

      <p className="mt-2 text-center font-mono text-[11px] text-ink-300">
        <strong className="text-ink-500">Enter</strong> to send &middot;{" "}
        <strong className="text-ink-500">Shift + Enter</strong> for a new line
      </p>
    </div>
  );
}
