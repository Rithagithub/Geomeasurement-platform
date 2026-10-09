"use client";

import { useRouter } from "next/navigation";
import { BookOpen, TrendingUp, Award, Rocket, MessagesSquare, ArrowUpRight } from "lucide-react";

const ACTIONS = [
  { label: "Browse courses", href: "/courses", icon: BookOpen },
  { label: "View progress", href: "/progress", icon: TrendingUp },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Start learning", href: "/courses", icon: Rocket },
  { label: "Ask the AI tutor", href: "/chat", icon: MessagesSquare },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="card p-6">
      <h2 className="font-display text-xl font-semibold text-ink-900">Quick actions</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {ACTIONS.map(({ label, href, icon: Icon }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="group flex flex-col items-start gap-3 rounded-xl border border-ink-900/[0.07] p-4 text-left transition hover:border-thread-500/40 hover:bg-thread-500/[0.05]"
          >
            <div className="flex w-full items-center justify-between">
              <Icon size={18} className="text-thread-600" />
              <ArrowUpRight
                size={14}
                className="text-ink-300 opacity-0 transition group-hover:opacity-100"
              />
            </div>
            <span className="text-sm font-medium text-ink-800">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
