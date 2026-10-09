"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ProfileResponse } from "@/types/profile";
import settingsService from "@/services/settingsService";

interface Props {
  profile: ProfileResponse;
  onClose: () => void;
  onSaved: (fullName: string) => void;
}

export default function EditProfileModal({ profile, onClose, onSaved }: Props) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!fullName.trim()) return;

    setSaving(true);
    setError("");

    try {
      await settingsService.updateProfile({ fullName });
      onSaved(fullName);
      onClose();
    } catch (e) {
      console.error(e);
      setError("Unable to update profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card w-full max-w-sm animate-fade-up p-7"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink-900">Edit profile</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-ink-300 transition hover:bg-ink-900/[0.05] hover:text-ink-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6">
          <label className="field-label">Full name</label>
          <input
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="mt-2">
          <label className="field-label">Email</label>
          <input className="input-field opacity-60" value={profile.email} disabled />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-coral-500/30 bg-coral-500/10 p-3 text-sm text-coral-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-signal flex-1">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
