"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import ProgressCard from "@/components/progress/ProgressCard";
import ProgressChart from "@/components/progress/ProgressChart";

import progressService from "@/services/progressService";
import { Progress } from "@/types/progress";

export default function ProgressPage() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await progressService.getProgress();
        setProgress(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="mt-24 flex flex-col items-center gap-3 text-center">
          <span className="node-dot animate-pulse" />
          <p className="eyebrow text-ink-400">Loading progress…</p>
        </div>
      </MainLayout>
    );
  }

  const totalHours = progress.reduce((sum, p) => sum + p.hoursSpent, 0);
  const completedCount = progress.filter((p) => p.completion === 100).length;

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Your path so far"
        title="Learning progress"
        subtitle="Every course below is an edge in your knowledge graph — track how each one is filling in."
      />

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card p-6">
          <p className="eyebrow text-ink-400">Courses</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-ink-900">{progress.length}</p>
        </div>
        <div className="card p-6">
          <p className="eyebrow text-ink-400">Completed</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-ink-900">{completedCount}</p>
        </div>
        <div className="card p-6">
          <p className="eyebrow text-ink-400">Hours spent</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-ink-900">{totalHours}</p>
        </div>
      </div>

      {progress.length > 0 && (
        <div className="mb-8">
          <ProgressChart progress={progress} />
        </div>
      )}

      {progress.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-16 text-center">
          <span className="node-dot" />
          <p className="mt-2 font-display text-lg font-semibold text-ink-900">Nothing tracked yet</p>
          <p className="text-sm text-ink-400">Enroll in a course to start building your progress graph.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {progress.map((course) => (
            <ProgressCard key={course.courseId} progress={course} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
