"use client";
import React from "react";
import InfluencerProfile from "./InfluencerProfile";
import CollabsWithCompanies from "./CollabsWithCompanies";
import RecentActivities from "../../components-common/tables/RecentActivity";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import TopVideosCraetor from "../../components-common/tables/topVideos";

export default function CreatorProfile() {
  return (
    <div className="flex flex-col p-4 gap-5">
      <div className="grid grid-cols-2 gap-5 w-full">
        <InfluencerProfile />
        <div className="flex flex-col gap-5">
          <ProfileCompletionCard />
          <CollabsWithCompanies />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 w-full">
        <div className="col-span-2 h-full">
          <TopVideosCraetor />
        </div>
        <div className="h-full">
          <PerformanceSummaryChart />
        </div>
      </div>
    </div>
  );
}
