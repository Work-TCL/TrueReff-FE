"use client";
import React from "react";
import { StatsCard } from "../../components-common/states/StatesCard";
import RecentActivities from "../../components-common/tables/RecentActivity";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import { translate } from "@/lib/utils/translate";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";
import DonutChart from "../../components-common/charts/DonutChat";
import VideoWiseRevenueChart from "../../components-common/charts/videoWiseBarChart";
import TrendingInsights from "../dashboard/trending-insights";

export default function PaymentEarnings() {
  const chartData = [
    { name: translate("Revenue"), value: 76, color: "#BEDBFC" },
    { name: translate("Total Views"), value: 24, color: "#FED6AF" },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 gap-4 col-span-3 ">
        <StatsCard
          title={translate("Active_Collaborations")}
          value={120}
          growth={5}
          bgColor="bg-white bg-[#f2f1fd]"
          borderColor={"border-[#7877EE]"}
        />
        <StatsCard
          title={translate("Total_Products")}
          value={200}
          growth={5}
          borderColor="border-[#EB815B]"
          bgColor="bg-[#fdf2ef]"
        />
        <StatsCard
          title={translate("Active_Campaigns")}
          value={200}
          growth={5}
          borderColor="border-[#77EE8D]"
          bgColor="bg-[#f1fdf4]"
        />
        <StatsCard
          title={translate("Pending_Bids")}
          value={200}
          growth={5}
          borderColor="border-[#9773C8]"
          bgColor="bg-[#f5f1fa]"
        />
      </div>
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        <div className="flex flex-col xl:w-2/3 gap-5">
          <RecentActivities />
        </div>
        <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/3 gap-4">
          {/* <PerformanceSummaryChart /> */}
          <VideoWiseRevenueChart />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        <div className="flex flex-col xl:w-3/4 gap-5">
          <RecentActivities />
        </div>
        <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/4 gap-4">
          {/* <PerformanceSummaryChart /> */}
          <TrendingInsights
            header={translate("Product View Revenue")}
            data={chartData}
            legendClassName="flex-row whitespace-nowrap "
          />
        </div>
      </div>
    </div>
  );
}
