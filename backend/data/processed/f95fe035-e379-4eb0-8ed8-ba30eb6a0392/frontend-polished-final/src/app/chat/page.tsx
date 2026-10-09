"use client";

import { Bot } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import ChatWindow from "@/components/chat/ChatWindow";
import PromptInput from "@/components/chat/PromptInput";
import EmptyState from "@/components/chat/EmptyState";

import { useChatStore } from "@/store/chatStore";

export default function ChatPage() {
  const { messages, sendMessage, loading } = useChatStore();

  const handlePrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)] min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-900/[0.06] bg-paper-50 shadow-lifted">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-ink-900/[0.06] bg-ink-900 px-6 py-5 text-paper-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-500 text-ink-950">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">AI Tutor</h1>
            <p className="mt-0.5 text-[13px] text-paper-50/50">
              Ask questions, generate notes, or turn a concept into a quiz.
            </p>
          </div>
        </div>

        {/* Scrollable chat */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-paper-100">
          {messages.length === 0 ? <EmptyState onPrompt={handlePrompt} /> : <ChatWindow />}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-ink-900/[0.06] bg-paper-50">
          {loading && (
            <div className="flex items-center gap-2 px-6 py-2 font-mono text-xs text-ink-400">
              <span className="node-dot h-1.5 w-1.5" /> AI tutor is thinking…
            </div>
          )}

          <PromptInput />
        </div>
      </div>
    </MainLayout>
  );
}
