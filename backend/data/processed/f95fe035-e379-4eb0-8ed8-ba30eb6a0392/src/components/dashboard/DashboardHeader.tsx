interface Props {
  fullName: string;
}

export default function DashboardHeader({ fullName }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = fullName?.split(" ")[0] ?? fullName;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-900 p-8 text-paper-50 shadow-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(rgba(238,240,238,0.1) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-paper-50/40">{greeting}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">{firstName}</h1>
          <p className="mt-3 max-w-lg text-[15px] text-paper-50/55">
            Continue learning, take a quiz, or ask your AI tutor about the concept
            you're stuck on.
          </p>
        </div>

        <svg width="140" height="70" viewBox="0 0 140 70" fill="none" aria-hidden="true" className="hidden sm:block">
          <path d="M6 60 L45 25 L85 45 L134 12" stroke="#2F8F7C" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="6" cy="60" r="4" fill="#EEF0EE" fillOpacity="0.4" />
          <circle cx="45" cy="25" r="4" fill="#EEF0EE" fillOpacity="0.4" />
          <circle cx="85" cy="45" r="4" fill="#EEF0EE" fillOpacity="0.4" />
          <circle cx="134" cy="12" r="6" fill="#E7A33E" />
        </svg>
      </div>
    </div>
  );
}
