"use client";

import { Pencil } from "lucide-react";
import { ProfileResponse } from "@/types/profile";

interface Props {
  profile: ProfileResponse;
  onEdit?: () => void;
}

export default function ProfileInfo({ profile, onEdit }: Props) {
  const initial = profile.fullName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="card relative overflow-hidden p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-900 font-display text-2xl font-semibold text-paper-50">
            {initial}
          </div>

          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-900">{profile.fullName}</h1>
            <p className="mt-1 text-sm text-ink-400">{profile.email}</p>
            <span className="badge mt-3 border-thread-500/30 text-thread-700">{profile.role}</span>
          </div>
        </div>

        {onEdit && (
          <button onClick={onEdit} className="btn-ghost">
            <Pencil size={15} />
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
}
