interface Props {
  dark?: boolean;
}

export default function Logo({ dark = false }: Props) {
  const textColor = dark ? "text-paper-50" : "text-ink-900";
  const subColor = dark ? "text-paper-50/50" : "text-ink-400";

  return (
    <div className="flex items-center gap-3">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <circle cx="7" cy="23" r="3" fill="#2F8F7C" />
        <circle cx="23" cy="7" r="3" fill="#E7A33E" />
        <circle cx="15" cy="15" r="2.4" fill={dark ? "#EEF0EE" : "#12151C"} />
        <path
          d="M7 23 L15 15 L23 7"
          stroke={dark ? "#EEF0EE" : "#12151C"}
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      </svg>

      <div className="leading-tight">
        <p className={`font-display text-[17px] font-semibold ${textColor}`}>
          Learning Agency
        </p>
        <p className={`eyebrow ${subColor}`}>Chart your own path</p>
      </div>
    </div>
  );
}
