"use client";

import React from "react";
import SalesChart from "../../components-common/charts/SalesChart";
import DonutChart from "../../components-common/charts/DonutChat";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import RecentActivities from "../../components-common/tables/RecentActivity";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import StatesCards from "../../components-common/states/StatesCard";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";
import PerformanceSummaryChartDashBoard from "../../components-common/charts/performanceSummary";

export default function Overview() {
  const lg = useMediaQuery("(min-width: 1024px)");
  return ( <div className="flex flex-col gap-4 p-6 w-full">
      <StatesCards />
    <div className="flex flex-col xl:flex-row gap-5 w-full">
      <div className="flex flex-col xl:w-3/4 gap-5">
        <div className="flex flex-col md:flex-row gap-4">
          <SalesChart />
          <DonutChart />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
      <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/4 gap-4">
        <MostSellingBrands />
        <VendorActivity />
      </div>
    </div>
    </div>
  );
}
