"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Target, TrendingUp, Award, Clock } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import analyticsService, {
  AnalyticsResponse,
} from "@/services/analyticsService";
import dashboardService from "@/services/dashboardService";
import { DashboardResponse } from "@/types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await dashboardService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error("Dashboard Load Failed", error);
      }
    }

    loadDashboard();
    async function loadAnalytics() {
  try {
    const data = await analyticsService.getAnalytics();
    setAnalytics(data);
  } catch (error) {
    console.error("Analytics Load Failed", error);
  }
}

loadAnalytics();
  }, []);

  if (!dashboard || !analytics)  {
    return (
      <MainLayout>
        <div className="mt-24 flex flex-col items-center gap-3 text-center">
          <span className="node-dot animate-pulse" />
          <p className="eyebrow text-ink-400">Loading dashboard…</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DashboardHeader fullName={dashboard.fullName} />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Enrolled courses" value={dashboard.enrolledCourses} icon={BookOpen} accent="thread" />
        <StatCard title="Completed courses" value={dashboard.completedCourses} icon={CheckCircle2} accent="signal" />
        <StatCard title="Average quiz score" value={`${dashboard.averageQuizScore}%`} icon={Target} accent="thread" />
        <StatCard title="Overall progress" value={`${dashboard.overallProgress}%`} icon={TrendingUp} accent="coral" />
        <StatCard title="Certificates earned" value={dashboard.certificatesEarned} icon={Award} accent="signal" />
        <StatCard title="Learning hours" value={`${dashboard.learningHours} hrs`} icon={Clock} accent="thread" />
      </div>

  <DashboardGrid analytics={analytics} />

      <div className="mt-8">
        <QuickActions />
      </div>
    </MainLayout>
  );
}
