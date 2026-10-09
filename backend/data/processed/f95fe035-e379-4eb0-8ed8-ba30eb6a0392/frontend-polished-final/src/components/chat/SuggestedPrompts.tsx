"use client";

import { useChatStore } from "@/store/chatStore";
import {
  BookOpen,
  NotebookPen,
  Target,
  Briefcase,
  ListChecks,
  Code2,
  Lightbulb,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

interface Props {
  onSelect: (prompt: string) => Promise<void>;
}

const prompts: { title: string; prompt: string; icon: LucideIcon }[] = [
  { title: "Explain a topic", prompt: "Explain today's topic in a simple way with examples.", icon: BookOpen },
  { title: "Generate notes", prompt: "Generate concise revision notes for this topic.", icon: NotebookPen },
  { title: "Create a quiz", prompt: "Create 10 multiple choice questions with answers.", icon: Target },
  { title: "Interview questions", prompt: "Generate important interview questions with answers.", icon: Briefcase },
  { title: "Summarize", prompt: "Summarize this topic into key points.", icon: ListChecks },
  { title: "Coding challenge", prompt: "Give me a coding challenge with a solution.", icon: Code2 },
  { title: "Explain with example", prompt: "Explain this concept using real-world examples.", icon: Lightbulb },
  { title: "Ask anything", prompt: "I have a question about my course.", icon: HelpCircle },
];

export default function SuggestedPrompts({ onSelect }: Props) {
  const { loading } = useChatStore();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {prompts.map((item) => (
        <button
          key={item.title}
          disabled={loading}
          onClick={() => onSelect(item.prompt)}
          className="card group p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-thread-500/40 hover:shadow-lifted disabled:opacity-50"
        >
          <item.icon size={18} className="text-thread-600" />
          <h3 className="mt-3 font-semibold text-ink-800">{item.title}</h3>
          <p className="mt-1.5 text-sm text-ink-400">{item.prompt}</p>
        </button>
      ))}
    </div>
  );
}
