import { Quiz } from "@/types/quiz";

interface Props {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: Props) {
  return (
    <div className="card p-6">
      <p className="eyebrow text-thread-600">{quiz.courseTitle}</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">{quiz.title}</h1>
      <p className="mt-2 text-sm text-ink-400">{quiz.description}</p>
    </div>
  );
}
