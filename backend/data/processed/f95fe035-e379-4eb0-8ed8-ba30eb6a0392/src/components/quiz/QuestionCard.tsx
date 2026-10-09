"use client";

import { Question } from "@/types/quiz";

interface Props {
  question: Question;
  index: number;
  selected?: string;
  onSelect: (questionId: number, option: string) => void;
}

export default function QuestionCard({ question, index, selected, onSelect }: Props) {
  const options = [
    { key: "A", value: question.optionA },
    { key: "B", value: question.optionB },
    { key: "C", value: question.optionC },
    { key: "D", value: question.optionD },
  ];

  return (
    <div className="card p-6">
      <p className="eyebrow text-thread-600">Question {index + 1}</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-ink-900">{question.question}</h2>

      <div className="mt-5 space-y-3">
        {options.map((option) => {
          const active = selected === option.key;

          return (
            <button
              key={option.key}
              onClick={() => onSelect(question.id, option.key)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                active
                  ? "border-signal-500 bg-signal-500/10"
                  : "border-ink-900/10 hover:border-thread-500/30 hover:bg-thread-500/[0.05]"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                  active ? "bg-signal-500 text-ink-950" : "bg-ink-900/[0.06] text-ink-500"
                }`}
              >
                {option.key}
              </span>
              <span className="text-ink-800">{option.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
