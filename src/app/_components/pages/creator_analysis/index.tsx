"use client";
import React from "react";
import { StatsCard } from "../../components-common/states/StatesCard";
import RecentActivities from "../../components-common/tables/RecentActivity";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";
import { useTranslations } from "next-intl";

export default function CreatorAnalysis() {
  const translate = useTranslations();
  return (
    <div className="flex flex-col gap-4 md:p-6 p-4 w-full">
      {" "}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4 col-span-3">
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
        <StatsCard
          title={translate("New_Brands")}
          value={200}
          growth={5}
          borderColor="border-[#C861A0]"
          bgColor="bg-[#faeff6]"
        />
      </div>
      <div className="flex flex-col xl:flex-row gap-5 w-full">
        <div className="flex flex-col xl:w-2/3 gap-5">
          <PerformanceSummaryChart />
        </div>
        <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/3 gap-4">
          <MostSellingBrands />
        </div>
      </div>
      <div>
        <RecentActivities />
      </div>
    </div>
  );
}
