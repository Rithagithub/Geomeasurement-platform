interface Props {
  title: string;
  value: string | number;
}

export default function ProfileCard({ title, value }: Props) {
  return (
    <div className="card p-6">
      <p className="eyebrow text-ink-400">{title}</p>
      <h2 className="mt-1 font-mono text-2xl font-semibold text-ink-900">{value}</h2>
    </div>
  );
}
