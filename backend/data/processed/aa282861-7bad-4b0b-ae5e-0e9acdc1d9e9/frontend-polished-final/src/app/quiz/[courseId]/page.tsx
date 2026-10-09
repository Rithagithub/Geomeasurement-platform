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

const getFallbackQuiz = (courseId: number): Quiz => {
  const courseMap: Record<number, string> = {
    1: "Java Programming",
    2: "Spring Boot Masterclass",
    3: "React & Next.js",
    4: "Machine Learning",
    5: "Data Structures & Algorithms",
    6: "Distributed Systems Design",
    7: "System Design for Engineers",
    8: "DevOps & Cloud Infrastructure",
    9: "Cybersecurity Fundamentals",
    10: "Data Engineering with Python",
  };

  const courseTitle = courseMap[courseId] ?? `Course ${courseId}`;

  return {
    id: courseId,
    title: `${courseTitle} Quiz`,
    description: "Check your understanding of the core ideas in this course.",
    courseTitle,
    questions: [
      {
        id: 1,
        question: "Which action best demonstrates practical understanding of this course?",
        optionA: "Building a small project based on the concepts",
        optionB: "Only reading the material once",
        optionC: "Skipping exercises",
        optionD: "Waiting for someone else to do the work",
      },
      {
        id: 2,
        question: "What is the most important habit for mastering this subject?",
        optionA: "Consistent practice and feedback",
        optionB: "Memorizing without application",
        optionC: "Avoiding mistakes",
        optionD: "Skipping the fundamentals",
      },
      {
        id: 3,
        question: "Which approach helps you learn the material fastest?",
        optionA: "Applying concepts to real examples",
        optionB: "Only watching without trying",
        optionC: "Ignoring hard problems",
        optionD: "Relying on guesswork",
      },
      {
        id: 4,
        question: "Why is reviewing feedback useful in a learning path like this?",
        optionA: "It highlights mistakes and improves performance",
        optionB: "It makes the material harder",
        optionC: "It removes the need to practice",
        optionD: "It creates confusion",
      },
    ],
  };
};

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
      try {
        const data = await quizService.getQuiz(courseId);
        setQuiz(data);
      } catch (error) {
        console.error("Failed to load quiz:", error);
        setQuiz(getFallbackQuiz(courseId));
      }
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
        <div className="mt-24 flex flex-col items-center gap-4 text-center">
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
