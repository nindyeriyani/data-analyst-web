import Badges from "@/components/dashboard/Badges";
import Greeting from "@/components/dashboard/Greeting";
import ModuleCards from "@/components/dashboard/ModuleCards";
import RecentlyCompleted from "@/components/dashboard/RecentlyCompleted";
import StatCards from "@/components/dashboard/StatCards";
import ThisWeek from "@/components/dashboard/ThisWeek";
import WeeklyChart from "@/components/dashboard/WeeklyChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Greeting />
      <WeeklyChart />
      <StatCards />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ThisWeek />
        <div className="space-y-6">
          <Badges />
          <RecentlyCompleted />
        </div>
      </div>

      <ModuleCards />
    </div>
  );
}
