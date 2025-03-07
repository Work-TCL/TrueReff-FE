"use client";
import React from "react";
import InfluencerProfile from "./InfluencerProfile";
import CollabsWithCompanies from "./CollabsWithCompanies";
import RecentActivities from "../../components-common/tables/RecentActivity";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";

export default function CreatorProfile(){
    return <div className="flex flex-col p-4 gap-4"><div className="flex gap-4">
        <InfluencerProfile/>
        <CollabsWithCompanies/>
    </div>
    <div className="flex flex-col xl:flex-row gap-5 w-full">
                <div className="flex flex-col xl:w-3/4 gap-5">
                <RecentActivities />
                </div>
                <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/4 gap-4">
                <PerformanceSummaryChart />
                </div>
            </div>
    </div>
}