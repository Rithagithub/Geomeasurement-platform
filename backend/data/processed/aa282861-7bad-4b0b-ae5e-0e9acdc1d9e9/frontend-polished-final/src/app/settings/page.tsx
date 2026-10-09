"use client";

import { useState } from "react";
import { User, KeyRound } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import settingsService from "@/services/settingsService";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const updateProfile = async () => {
    setSavingProfile(true);
    setProfileMessage("");

    try {
      const message = await settingsService.updateProfile({ fullName });
      setProfileMessage(message || "Profile updated.");
    } catch (e) {
      console.error(e);
      setProfileMessage("Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async () => {
    setSavingPassword(true);
    setPasswordMessage("");

    try {
      const message = await settingsService.changePassword({ currentPassword, newPassword });
      setPasswordMessage(message || "Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      console.error(e);
      setPasswordMessage("Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader eyebrow="Account" title="Settings" subtitle="Manage your profile and account security." />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-thread-500/15 text-thread-700">
              <User size={17} />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink-900">Update profile</h2>
          </div>

          <div className="mt-6">
            <label className="field-label">Full name</label>
            <input
              className="input-field"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {profileMessage && <p className="mt-3 text-sm text-ink-400">{profileMessage}</p>}

          <button onClick={updateProfile} disabled={savingProfile || !fullName.trim()} className="btn-primary mt-5">
            {savingProfile ? "Saving…" : "Update profile"}
          </button>
        </div>

        <div className="card p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-500/15 text-signal-700">
              <KeyRound size={17} />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink-900">Change password</h2>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="field-label">Current password</label>
              <input
                type="password"
                className="input-field"
                placeholder="********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">New password</label>
              <input
                type="password"
                className="input-field"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {passwordMessage && <p className="mt-3 text-sm text-ink-400">{passwordMessage}</p>}

          <button
            onClick={updatePassword}
            disabled={savingPassword || !currentPassword || !newPassword}
            className="btn-signal mt-5"
          >
            {savingPassword ? "Updating…" : "Change password"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
