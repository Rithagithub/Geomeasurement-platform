"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Clock3, Award, Target, Timer } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";

import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import CompletionChart from "@/components/analytics/CompletionChart";
import QuizChart from "@/components/analytics/QuizChart";
import WeeklyChart from "@/components/analytics/WeeklyChart";
import RecentActivity from "@/components/analytics/RecentActivity";

import analyticsService, { AnalyticsResponse } from "@/services/analyticsService";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await analyticsService.getAnalytics();
        setAnalytics(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="mt-24 flex flex-col items-center gap-3 text-center">
          <span className="node-dot animate-pulse" />
          <p className="eyebrow text-ink-400">Loading analytics…</p>
        </div>
      </MainLayout>
    );
  }

  if (!analytics) {
    return (
      <MainLayout>
        <div className="card mt-10 flex flex-col items-center gap-2 p-16 text-center">
          <p className="font-display text-lg font-semibold text-ink-900">Couldn't load analytics</p>
          <p className="text-sm text-ink-400">Give it a moment and refresh the page.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Coming soon"
        title="Learning analytics"
        subtitle="A closer look at how your time, quizzes, and courses add up."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
<AnalyticsCard
  title="Agency Score"
  value={analytics.agencyScore.toFixed(1)}
  icon={Target}
  accent="thread"
/>

<AnalyticsCard
  title="Improvement"
  value={`${analytics.improvement.toFixed(1)}%`}
  icon={CheckCircle2}
  accent="signal"
/>

<AnalyticsCard
  title="Agency Preservation"
  value={`${analytics.agencyPreservationIndex.toFixed(1)}%`}
  icon={Award}
  accent="signal"
/>

<AnalyticsCard
  title="Learning Betweenness"
  value={analytics.dynamicLearningBetweenness.toFixed(1)}
  icon={BookOpen}
  accent="thread"
/>

<AnalyticsCard
  title="AI Dependency"
  value={`${analytics.aiDependency.toFixed(1)}%`}
  icon={Clock3}
  accent="coral"
/>

<AnalyticsCard
  title="Collaboration Score"
  value={`${analytics.collaborationScore.toFixed(1)}%`}
  icon={Timer}
  accent="thread"
/>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <CompletionChart analytics={analytics} />
        <QuizChart analytics={analytics} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WeeklyChart />
        <RecentActivity />
      </div>
    </MainLayout>
  );
}
