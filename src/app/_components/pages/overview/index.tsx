"use client";

import React, { useEffect, useState } from "react";
import SalesChart from "../../components-common/charts/SalesChart";
import DonutChart from "../../components-common/charts/DonutChat";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import RecentActivities from "../../components-common/tables/RecentActivity";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import { StatsCard } from "../../components-common/states/StatesCard";
import { translate } from "@/lib/utils/translate";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { getStatesInfo } from "@/lib/web-api/vendor-dashboard";
import Loading from "@/app/vendor/loading";
import { IStateInfo } from "@/lib/types-api/vendor-dashboard";

export default function Overview() {
  const initialStateInfo = {
    activeCollaborations: 0,
    pendingCollaborations: 0,
    activeCampaigns: 0,
    last7DaysCreator: 0,
  };
  const [statesInfo, setStatesInfo] = useState<IStateInfo>(initialStateInfo);
  const [mainLoading, setMailLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStatesInfo();
  }, []);
  const fetchStatesInfo = async () => {
    setMailLoading(true);
    try {
      const response = await getStatesInfo();
      if (response) {
        setStatesInfo(response);
      } else {
        setStatesInfo(initialStateInfo);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      toastMessage.error(errorMessage);
      setStatesInfo(initialStateInfo);
    } finally {
      setMailLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 md:p-6 p-4  w-full">
      {mainLoading && <Loading />}
      <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-4 rounded-[20px] w-full">
        <StatsCard
          title={translate("Active_Collaborations")}
          value={statesInfo?.activeCollaborations}
          growth={5}
          bgColor="bg-white bg-[#f2f1fd]"
          borderColor={"border-[#7877EE]"}
        />
        <StatsCard
          title={translate("Products_Sales")}
          value={200}
          growth={5}
          borderColor="border-[#EB815B]"
          bgColor="bg-[#fdf2ef]"
        />
        <StatsCard
          title={translate("Active_Campaigns")}
          value={statesInfo?.activeCampaigns}
          growth={5}
          borderColor="border-[#77EE8D]"
          bgColor="bg-[#f1fdf4]"
        />
        <StatsCard
          title={translate("Pending_Collaboration")}
          value={statesInfo?.pendingCollaborations}
          growth={5}
          borderColor="border-[#9773C8]"
          bgColor="bg-[#f5f1fa]"
        />
        <StatsCard
          title={translate("New_Creators")}
          value={statesInfo?.last7DaysCreator}
          growth={5}
          borderColor="border-[#C861A0]"
          bgColor="bg-[#faeff6]"
        />
      </div>
      <div className="flex flex-col gap-5 w-full">
        {/* Row 1: SalesChart + DonutChart and MostSellingBrands */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch w-full">
          {/* Left block: SalesChart + DonutChart (in column) */}
          <div className="flex flex-col gap-4 xl:w-3/4 w-full h-full">
            <div className="flex flex-col md:flex-row gap-4 h-full items-stretch">
              <div className="flex-1 flex">
                <SalesChart />
              </div>
              <div className="flex-1 flex">
                <DonutChart />
              </div>
            </div>
          </div>

          {/* Right block: MostSellingBrands */}
          <div className="xl:w-1/4 w-full flex">
            <MostSellingBrands />
          </div>
        </div>

        {/* Row 2: RecentActivities and VendorActivity */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch w-full">
          {/* Left block: RecentActivities */}
          <div className="xl:w-3/4 w-full flex">
            <RecentActivities />
          </div>

          {/* Right block: VendorActivity */}
          <div className="xl:w-1/4 w-full flex">
            <VendorActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
