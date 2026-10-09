"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";

import ProfileCard from "@/components/profile/ProfileCard";
import ProfileInfo from "@/components/profile/ProfileInfo";
import EditProfileModal from "@/components/profile/EditProfileModal";

import profileService from "@/services/profileService";

import { ProfileResponse } from "@/types/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="mt-24 flex flex-col items-center gap-3 text-center">
          <span className="node-dot animate-pulse" />
          <p className="eyebrow text-ink-400">Loading profile…</p>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="card mt-10 flex flex-col items-center gap-2 p-16 text-center">
          <p className="font-display text-lg font-semibold text-ink-900">Unable to load profile</p>
          <p className="text-sm text-ink-400">Give it a moment and refresh the page.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        subtitle="How you show up across Learning Agency."
      />

      <div className="space-y-6">
        <ProfileInfo profile={profile} onEdit={() => setEditing(true)} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ProfileCard title="Agency score" value={profile.agencyScore} />
          <ProfileCard title="Learning time" value={`${profile.learningTime} hrs`} />
          <ProfileCard title="Concepts mastered" value={profile.conceptsMastered} />
          <ProfileCard title="Sessions" value={profile.sessions} />
        </div>
      </div>

      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSaved={(fullName) => setProfile({ ...profile, fullName })}
        />
      )}
    </MainLayout>
  );
}
