import AgencyScoreCard from "./AgencyScoreCard";
import LearningProgress from "./LearningProgress";
import RecentActivity from "./RecentActivity";

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8">

      <div className="lg:col-span-2">
        <AgencyScoreCard />
      </div>

      <div>
        <LearningProgress />
      </div>

      <div className="lg:col-span-3">
        <RecentActivity />
      </div>

    </div>
  );
}