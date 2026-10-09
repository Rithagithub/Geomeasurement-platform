"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

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
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 text-ink-500 transition hover:bg-ink-900/[0.04]"
        >
          <Bell size={16} />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* Profile */}
        <div className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 font-display text-[15px] font-semibold text-paper-50">
          R
        </div>
      </div>
    </header>
  );
}