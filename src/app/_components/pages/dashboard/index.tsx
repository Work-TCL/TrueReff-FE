"use client";
import React, { useEffect, useState } from "react";
import StatesCards, {
  StatsCard,
} from "../../components-common/states/StatesCard";
import RecentActivities from "../../components-common/tables/RecentActivity";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import { translate } from "@/lib/utils/translate";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";
import DonutChart from "../../components-common/charts/DonutChat";
import CollaborationAchievements from "./collaboration-achievements";
import ProductInsights from "./product-insights";
import EarningsPayments from "./earnings-payments";
import TrendingInsights from "./trending-insights";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import PerformanceSummaryChartDashBoard from "../../components-common/charts/performanceSummary";
import TrendingInsightsDiscoverability from "../../components-common/charts/trendingInsightsDiscoverability";
import { getCreatorProgress } from "@/lib/web-api/auth";

export default function Dashboard() {
  const lg = useMediaQuery("(min-width: 1024px)");
  const [creatorDetails,setCreatorDetails] = useState<any>({ completed: 0 })
  const data = [
    { name: translate("Most_selling_products"), value: 76, color: "#BEDBFC" },
    { name: translate("Low-Performing_products"), value: 24, color: "#FED6AF" },
  ];
  const getCreator = async () => {
      try {
        const creator = await getCreatorProgress();
        console.log("creator",creator)
        setCreatorDetails(creator);
      } catch (e) {

      }
    };
    useEffect(() => {
      getCreator();
    },[])
  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="flex flex-col gap-6 w-full lg:max-w-[774px]">
          {!lg && <ProfileCompletionCard progress={creatorDetails?.completed}/>}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-4 rounded-[20px] w-full bg-white p-4">
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
          <PerformanceSummaryChartDashBoard />
        </div>
        <div className="flex flex-col gap-6 w-full">
          {lg && <ProfileCompletionCard />}
          <MostSellingBrands />
        </div>
      </div>
      <div className="flex xl:flex-row flex-col gap-4 w-full">
        <div className=" bg-white p-4 rounded-lg shadow w-full">
          <RecentActivities />
        </div>
        <div className="flex gap-4 sm:flex-row flex-col w-full">
          <VendorActivity />
          {/* <DonutChart /> */}
          <TrendingInsightsDiscoverability />
        </div>
      </div>
    </div>
  );
}
