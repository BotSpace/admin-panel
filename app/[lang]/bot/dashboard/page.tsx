import { ActivitySection } from "@/components/dashboard/activity-section";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { StatisticCards } from "@/components/dashboard/statistic-cards";
import React from "react";

type Props = {};

function Page({}: Props) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Statistic Cards Section */}
      <StatisticCards />

      {/* Activity & Recent Users Section */}
      <ActivitySection />

      {/* Growth Chart Section */}
      <GrowthChart />
    </div>
  );
}

export default Page;
