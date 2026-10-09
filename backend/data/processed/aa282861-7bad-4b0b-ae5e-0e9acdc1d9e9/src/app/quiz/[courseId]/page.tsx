"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import QuestionCard from "@/components/quiz/QuestionCard";
import ScoreCard from "@/components/quiz/ScoreCard";
import quizService from "@/services/quizService";

import { Quiz } from "@/types/quiz";
import { QuizSubmissionResponse } from "@/types/quizResult";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.courseId);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      const data = await quizService.getQuiz(courseId);
      setQuiz(data);
    }

    if (courseId) {
      loadQuiz();
    }
  }, [courseId]);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const submitQuiz = async () => {
    if (!quiz) return;

    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Answer every question before submitting.");
      return;
    }

    setLoading(true);

    try {
      const request = {
        quizId: quiz.id,
        answers: quiz.questions.map((question) => ({
          questionId: question.id,
          selectedOption: answers[question.id],
        })),
      };

      const response = await quizService.submitQuiz(request);
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

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

        <div className="mt-8 flex justify-center">
          <button onClick={() => router.push("/progress")} className="btn-primary">
            Continue to progress
            <ArrowRight size={15} />
          </button>
        </div>
      </MainLayout>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <MainLayout>
      <p className="eyebrow text-thread-600">{quiz.courseTitle}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{quiz.title}</h1>
      <p className="mt-2 max-w-xl text-[15px] text-ink-400">{quiz.description}</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="thread-track w-48">
          <span style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
        </div>
        <span className="font-mono text-xs text-ink-400">
          {answeredCount} / {quiz.questions.length} answered
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {quiz.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            selected={answers[question.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <button onClick={submitQuiz} disabled={loading} className="btn-signal mt-8 w-full sm:w-auto">
        {loading ? "Submitting…" : "Submit quiz"}
      </button>
    </MainLayout>
  );
}
