"use client";

import React, { useEffect, useState } from "react";
import SalesChart from "../../components-common/charts/SalesChart";
import DonutChart from "../../components-common/charts/suggested-creators";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import RecentActivities from "../../components-common/tables/RecentActivity";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import { StatsCard } from "../../components-common/states/StatesCard";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import {
  getStatesInfo,
  getVendorRevenuePerformance,
} from "@/lib/web-api/vendor-dashboard";
import Loading from "@/app/vendor/loading";
import { IStateInfo } from "@/lib/types-api/vendor-dashboard";
import { useTranslations } from "next-intl";
import Loader from "../../components-common/layout/loader";
import {
  currency,
  formatFloatValue,
  formatNumber,
} from "@/lib/utils/constants";
import { IRevenue, IRevenueData } from "@/lib/types-api/creator-dashboard";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { getSuggestedCreators } from "@/lib/web-api/auth";
import { IndianRupee } from "lucide-react";
import { Subject } from "rxjs";

export interface IChannel {
  followers: number;
  _id: string;
  creatorId: string;
  channelId: string;
  channelName: string;
  handleName: string;
  channelType: string;
  createdAt: string;
  updatedAt: string;
}

export const overviewFilter = new Subject<string>();

export default function Overview() {
  const translate = useTranslations();
  const initialStateInfo = {
    pendingCollaborations: 0,
    pendingCampaigns: 0,
    totalRevenue: 0,
    totalCommission: 0,
    totalOrders: 0,
    conversionRate: 0,
  };
  const [statesInfo, setStatesInfo] = useState<IStateInfo>(initialStateInfo);
  const [mainLoading, setMailLoading] = useState<boolean>(true);
  const [revenueData, setRevenueData] = useState<IRevenueData>({
    current: [],
    past: [],
  });
  const [updateData, setUpdateData] = useState<any[]>([]);
  const [suggestedCreators, setSuggestedCreators] = useState<any[]>([]);
  const [revenueLoading, setRevenueLoading] = useState<boolean>(true);
  const [creatorLoading, setCreatorLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStatesInfo();
    fetchRevenuePerformance();
    const subscription = overviewFilter.subscribe((value) => {
      console.log("Received value:", value);
      fetchStatesInfo(value);
      fetchRevenuePerformance(value);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    getCreatorSuggested();
  }, []);
  const getInstagramView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let instagram = channels.find(
      (ele: { channelType: string }) => ele.channelType === "instagram"
    );
    return instagram ? formatNumber(instagram?.followers) : "0";
  };
  const getYoutubeView: (channels: IChannel[]) => string = (
    channels: IChannel[]
  ) => {
    let youtube = channels.find(
      (ele: { channelType: string }) => ele.channelType === "youtube"
    );
    return youtube ? formatNumber(youtube?.followers) : "0";
  };
  const getCreatorSuggested = async () => {
    setCreatorLoading(true);
    try {
      const creators = await getSuggestedCreators();
      if (Array.isArray(creators)) {
        let result = creators.map((ele: any) => {
          ele.categories = ele.category
            ?.map((ele: { name: string }) => ele?.name)
            .join(", ");
          ele.tag = ele.tags?.join(",");
          ele.instagramFollowers = getInstagramView(ele.channels);
          ele.youtubeFollowers = getYoutubeView(ele.channels);
          //@ts-ignore
          // ele.pastSales = ele?.pastSales || "";
          return { ...ele };
        });
        setSuggestedCreators(result);
      }
    } catch (e) {
    } finally {
      setCreatorLoading(false);
    }
  };

  const fetchStatesInfo = async (value: string = "7") => {
    setMailLoading(true);
    try {
      const response = await getStatesInfo(value || "7");
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
  const fetchRevenuePerformance = async (value: string = "7") => {
    setRevenueLoading(true);
    try {
      const response = await getVendorRevenuePerformance(value || "7");
      if (response) {
        const currentData = response?.current?.map((ele: IRevenue) => ({
          ...ele,
          current: ele?.totalRevenue,
        }));
        const revenueData = response?.past?.map((ele: IRevenue) => ({
          ...ele,
          past: ele?.totalRevenue,
        }));
        setRevenueData({
          current: currentData,
          past: revenueData,
        });
        (response?.current?.length > 0 || response?.past?.length > 0) &&
          setUpdateData([
            {
              name: "Current Revenue",
              value: response?.current.reduce(
                (total: any, item: any) => total + item.totalRevenue,
                0
              ),
              color: "#FF4979",
            },
            {
              name: "Past Revenue",
              value: response?.past.reduce(
                (total: any, item: any) => total + item.totalRevenue,
                0
              ),
              color: "#090919",
            },
          ]);
      } else {
        setRevenueData({
          current: [],
          past: [],
        });
        setUpdateData([]);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      // toastMessage.error(errorMessage);
      setRevenueData({
        current: [],
        past: [],
      });
    } finally {
      setRevenueLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 md:p-4 p-2 w-full">
      {mainLoading && <Loader />}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 md:grid-cols-3 gap-2 rounded-[20px] w-full">
        <StatsCard
          title={translate("Pending_Campaigns")}
          value={formatNumber(statesInfo?.pendingCampaigns)}
          growth={5}
          bgColor="bg-white bg-[#f2f1fd]"
          borderColor={"border-[#7877EE]"}
          // link="/vendor/campaign?status=PENDING"
        />
        <StatsCard
          title={translate("Pending_Collaboration")}
          value={formatNumber(statesInfo?.pendingCollaborations)}
          growth={5}
          borderColor="border-[#EB815B]"
          bgColor="bg-[#fdf2ef]"
          link="/vendor/creators/collaboration?status=PENDING"
        />
        <StatsCard
          title={translate("Conversion_Rate")}
          value={`${formatFloatValue(statesInfo?.conversionRate)} %`}
          growth={5}
          borderColor="border-[#C861A0]"
          bgColor="bg-[#faeff6]"
        />
        <StatsCard
          title={translate("Orders")}
          value={formatNumber(statesInfo?.totalOrders)}
          growth={5}
          borderColor="border-[#9773C8]"
          bgColor="bg-[#f5f1fa]"
        />
        <StatsCard
          title={translate("Revenue")}
          value={`${formatNumber(statesInfo?.totalRevenue)}`}
          icon={<IndianRupee size={27} />}
          growth={5}
          borderColor="border-[#77EE8D]"
          bgColor="bg-[#f1fdf4]"
        />
        <StatsCard
          title={translate("Commission")}
          value={`${formatNumber(statesInfo?.totalCommission)}`}
          icon={<IndianRupee size={27} />}
          growth={5}
          borderColor="border-[#EB815B]"
          bgColor="bg-[#fdf2ef]"
        />
      </div>
      <div className="flex flex-col gap-5 w-full">
        {/* Row 1: SalesChart + DonutChart and MostSellingBrands */}
        <div className="flex flex-col xl:flex-row gap-4 items-stretch w-full">
          {/* Left block: SalesChart + DonutChart (in column) */}
          <div className="flex flex-col gap-4 xl:w-[60%] w-full h-full">
            <div className="flex flex-col md:flex-row gap-4 h-full items-stretch">
              <div className="flex xl:w-[65%] w-full">
                {revenueLoading ? (
                  <div className="w-full h-[400px] bg-white rounded-lg">
                    <Loading height="fit" />
                  </div>
                ) : revenueData?.current?.length > 0 ||
                  revenueData?.past?.length > 0 ? (
                  <SalesChart data={revenueData} />
                ) : (
                  <div className="min-h-[350px]">
                    <EmptyPlaceHolder
                      title={"No Revenue Found"}
                      description="Revenue Performance will be displayed here once activity data is available. Encourage users to participate to see leaderboard ranking."
                    />
                  </div>
                )}
              </div>
              <div className="flex xl:w-[35%] md:w-[50%] w-full">
                {creatorLoading ? (
                  <div className="w-full bg-white rounded-lg">
                    <Loading height="fit" />
                  </div>
                ) : suggestedCreators?.length > 0 ? (
                  <DonutChart data={suggestedCreators} />
                ) : (
                  <EmptyPlaceHolder
                    title="No Creators Update"
                    description="Creator Updates will be displayed here once activity data is available. Encourage users to participate to see leaderboard ranking."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right block: MostSellingBrands */}
          <div className="flex-1 w-full flex">
            <MostSellingBrands />
          </div>
        </div>

        {/* Row 2: RecentActivities */}
        <div className="w-full flex">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
