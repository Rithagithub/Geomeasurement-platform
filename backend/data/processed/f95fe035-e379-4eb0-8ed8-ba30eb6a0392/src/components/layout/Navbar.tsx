import { Search, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-ink-900/[0.06] bg-paper-50/80 px-8 backdrop-blur">
      <div className="relative w-full max-w-xs">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
        />
        <input
          type="text"
          placeholder="Search courses, concepts, people…"
          className="w-full rounded-lg border border-ink-900/10 bg-paper-100/60 py-2 pl-9 pr-3 text-[13px]
                     text-ink-900 outline-none transition placeholder:text-ink-300
                     focus:border-signal-500 focus:ring-2 focus:ring-signal-500/20"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-500 transition hover:bg-ink-900/[0.04]"
        >
          <Bell size={16} />
        </button>

        <div className="h-9 w-9 rounded-full bg-ink-900 text-paper-50 grid place-items-center font-display text-[15px] font-semibold">
          R
        </div>
      </div>
    </header>
  );
}
