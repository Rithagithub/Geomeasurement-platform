"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Award,
  MessagesSquare,
  Share2,
  BarChart3,
  UserCircle,
  Settings,
} from "lucide-react";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import Logo from "@/components/ui/Logo";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  "/dashboard": LayoutDashboard,
  "/courses": BookOpen,
  "/progress": TrendingUp,
  "/certificates": Award,
  "/chat": MessagesSquare,
  "/knowledge-graph": Share2,
  "/analytics": BarChart3,
  "/profile": UserCircle,
  "/settings": Settings,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-ink-900 px-5 py-7 text-paper-50">
      <div className="px-2">
        <Logo dark />
      </div>

      <nav className="relative mt-10 flex-1">
        {/* the thread — a single connecting line running through every stop on the path */}
        <span
          aria-hidden
          className="absolute left-[19px] top-2 bottom-2 w-px origin-top animate-grow-thread bg-paper-50/10"
        />

        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = ICONS[item.href] ?? BookOpen;
            const isSoon = item.title.includes("Coming Soon");
            const label = item.title.replace(" (Coming Soon)", "");
            const active = pathname === item.href;

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl py-2.5 pl-2 pr-3 text-[14px] transition-colors ${
                    active
                      ? "bg-paper-50/[0.08] text-paper-50"
                      : "text-paper-50/55 hover:bg-paper-50/[0.05] hover:text-paper-50/85"
                  }`}
                >
                  <span
                    className={`relative z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border transition-colors ${
                      active
                        ? "border-signal-500 bg-signal-500"
                        : "border-paper-50/25 bg-ink-900 group-hover:border-paper-50/50"
                    }`}
                  />
                  <Icon size={16} />
                  <span className="flex-1 truncate font-medium">{label}</span>
                  {isSoon && (
                    <span className="font-mono text-[9px] uppercase tracking-wide text-paper-50/35">
                      soon
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-xl border border-paper-50/10 bg-paper-50/[0.04] p-4">
        <p className="eyebrow text-paper-50/40">Agency score</p>
        <p className="mt-1 font-display text-2xl font-semibold text-paper-50">84</p>
        <div className="thread-track mt-3 bg-paper-50/10">
          <span style={{ width: "84%" }} />
        </div>
      </div>
    </aside>
  );
}
