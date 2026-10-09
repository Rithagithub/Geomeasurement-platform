"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";

import QuizCard from "@/components/quiz/QuizCard";
import QuestionCard from "@/components/quiz/QuestionCard";
import ScoreCard from "@/components/quiz/ScoreCard";

import quizService from "@/services/quizService";

import { Quiz } from "@/types/quiz";
import { QuizSubmissionResponse } from "@/types/quizResult";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      const data = await quizService.getQuiz(1);
      setQuiz(data);
    }

    loadQuiz();
  }, []);

  if (!quiz) {
    return (
      <MainLayout>
        <div className="mt-24 flex flex-col items-center gap-3 text-center">
          <span className="node-dot animate-pulse" />
          <p className="eyebrow text-ink-400">Loading quiz…</p>
        </div>
      </MainLayout>
    );
  }

  if (result) {
    return (
      <MainLayout>
        <ScoreCard
          correct={result.correctAnswers}
          wrong={result.wrongAnswers}
          percentage={result.percentage}
          passed={result.passed}
        />
      </MainLayout>
    );
  }

  const question = quiz.questions[current];

  async function submitQuiz() {
    if (!quiz) return;

    const response = await quizService.submitQuiz({
      quizId: quiz.id,
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: Number(questionId),
        selectedOption,
      })),
    });

    setResult(response);
  }

  return (
    <MainLayout>
      <QuizCard quiz={quiz} />

      <div className="mt-8">
        <QuestionCard
          question={question}
          index={current}
          selected={answers[question.id]}
          onSelect={(questionId, option) => setAnswers({ ...answers, [questionId]: option })}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <button disabled={current === 0} onClick={() => setCurrent(current - 1)} className="btn-ghost">
          Previous
        </button>

        {current === quiz.questions.length - 1 ? (
          <button onClick={submitQuiz} className="btn-signal">
            Submit quiz
          </button>
        ) : (
          <button onClick={() => setCurrent(current + 1)} className="btn-primary">
            Next
          </button>
        )}
      </div>
    </MainLayout>
  );
}
