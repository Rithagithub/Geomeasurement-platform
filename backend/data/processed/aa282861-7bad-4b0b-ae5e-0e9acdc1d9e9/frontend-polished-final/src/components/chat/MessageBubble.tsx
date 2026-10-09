"use client";

import { Bot, User, Copy, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "@/store/chatStore";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  sender: "user" | "ai";
  message: string;
}

export default function MessageBubble({ sender, message }: Props) {
  const isUser = sender === "user";

  const { regenerateLastResponse, loading } = useChatStore();

  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-signal-500">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`relative max-w-3xl rounded-2xl px-5 py-4 shadow-soft transition-all duration-200 hover:shadow-lifted ${
          isUser ? "bg-ink-900 text-paper-50" : "border border-ink-900/[0.07] bg-paper-50 text-ink-800"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-7">{message}</div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ children, className }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (match) {
                    return (
                      <SyntaxHighlighter language={match[1]} style={oneDark} PreTag="div">
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }

                  return (
                    <code className="rounded bg-ink-900/[0.06] px-1 py-0.5">{children}</code>
                  );
                },
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        )}

        {!isUser && (
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={copyMessage}
              className="rounded-lg p-1 text-ink-300 transition hover:bg-ink-900/[0.05] hover:text-thread-600"
              title="Copy"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            <button
              onClick={regenerateLastResponse}
              disabled={loading}
              className="rounded-lg p-1 text-ink-300 transition hover:bg-ink-900/[0.05] hover:text-signal-600 disabled:opacity-50"
              title="Regenerate"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-thread-600 text-paper-50">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
