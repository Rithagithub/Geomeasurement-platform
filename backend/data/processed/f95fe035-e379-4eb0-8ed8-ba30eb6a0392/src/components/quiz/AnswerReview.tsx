interface Props {
  question: string;
  selected: string;
}

export default function AnswerReview({ question, selected }: Props) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-medium text-ink-800">{question}</h3>
      <p className="mt-2 font-mono text-xs text-ink-400">Your answer: {selected}</p>
    </div>
  );
}
