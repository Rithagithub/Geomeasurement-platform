interface WelcomeCardProps {
  fullName: string;
}

export default function WelcomeCard({ fullName }: WelcomeCardProps) {
  return (
    <div className="card-dark p-8">
      <h1 className="font-display text-3xl font-semibold">Welcome back, {fullName}</h1>
      <p className="mt-3 text-[15px] text-paper-50/55">Continue your personalised AI learning journey.</p>
      <button className="btn-signal mt-6">Continue learning</button>
    </div>
  );
}
