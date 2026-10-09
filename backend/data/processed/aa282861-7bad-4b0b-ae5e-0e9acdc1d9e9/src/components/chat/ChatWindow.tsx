"use client";

import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const { messages, loading } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            sender={message.role === "assistant" ? "ai" : "user"}
            message={message.content}
          />
        ))}

        {loading && (
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-signal-500 shadow-soft">
              <Bot size={18} />
            </div>

            <div className="rounded-2xl border border-ink-900/[0.07] bg-paper-50 px-5 py-4 shadow-soft">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-thread-500" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-thread-500"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-thread-500"
                  style={{ animationDelay: "0.4s" }}
                />

                <span className="ml-2 font-mono text-xs text-ink-400">AI tutor is thinking…</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
