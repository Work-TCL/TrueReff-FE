"use client";
import React, { useEffect, useState } from "react";
import { StatsCard } from "../../components-common/states/StatesCard";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import PerformanceSummaryChartDashBoard from "../../components-common/charts/performanceSummary";
import TrendingInsightsDiscoverability from "../../components-common/charts/trendingInsightsDiscoverability";
import { getCreatorProgress, getSuggestedProducts } from "@/lib/web-api/auth";
import { toastMessage } from "@/lib/utils/toast-message";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  ICreatorStateInfo,
  IFollowers,
  IRevenue,
  IRevenueData,
  ITopBrands,
} from "@/lib/types-api/creator-dashboard";
import {
  getCreatorStatesInfo,
  getRevenuePerformance,
  getTopPerformingBrand,
} from "@/lib/web-api/creator-dashboard";
import TopBrands from "./top-brands";
import RecentCollaborations from "./recent-collaborations";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";
import SalesChart from "../../components-common/charts/SalesChart";
import DonutChart from "../../components-common/charts/suggested-products";
import { formatFloatValue, formatNumber } from "@/lib/utils/constants";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import Loading from "@/app/vendor/loading";
import { IndianRupee } from "lucide-react";
import { Subject } from "rxjs";

export const creatorDashboardFilter = new Subject<string>();

export default function Dashboard() {
  const translate = useTranslations();
  const lg = useMediaQuery("(min-width: 1024px)");
  const [creatorDetails, setCreatorDetails] = useState<any>({ completed: 0 });
  const initialStateInfo = {
    pendingCollaborations: 0,
    followers: [],
    totalRevenue: 0,
    totalCommission: 0,
    totalOrders: 0,
    conversionRate: 0,
  };
  const [statesInfo, setStatesInfo] =
    useState<ICreatorStateInfo>(initialStateInfo);
  const [brands, setBrans] = useState<ITopBrands[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<IRevenueData>({
    current: [],
    past: [],
  });
  const [updateData, setUpdateData] = useState<any[]>([]);
  const [mainLoading, setMailLoading] = useState<boolean>(true);
  const [brandLoading, setBrandLoading] = useState<boolean>(true);
  const [revenueLoading, setRevenueLoading] = useState<boolean>(true);
  const [productLoading, setProductLoading] = useState<boolean>(true);
  const getCreator = async () => {
    try {
      const creator = await getCreatorProgress();
      setCreatorDetails(creator);
    } catch (e) {}
  };
  const getProductSuggested = async () => {
    setProductLoading(true);
    try {
      const products = await getSuggestedProducts();
      // console.log("getProductSuggested", getProductSuggested);
      setProducts(products);
    } catch (e) {
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    fetchStatesInfo();
    fetchRevenuePerformance();
    const subscription = creatorDashboardFilter.subscribe((value) => {
      console.log("Received value:", value);
      fetchStatesInfo(value || "7");
      fetchRevenuePerformance(value || "7");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getCreator();
    fetchTopPerformingBrand();
    getProductSuggested();
  }, []);
  const fetchStatesInfo = async (value: string = "7") => {
    setMailLoading(true);
    try {
      const response = await getCreatorStatesInfo(value || "7");
      if (response) {
        setStatesInfo(response);
      } else {
        setStatesInfo(initialStateInfo);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      // toastMessage.error(errorMessage);
      setStatesInfo(initialStateInfo);
    } finally {
      setMailLoading(false);
    }
  };
  const fetchTopPerformingBrand = async () => {
    setBrandLoading(true);
    try {
      const response = await getTopPerformingBrand();
      if (response?.list?.length > 0) {
        setBrans(response?.list);
      } else {
        setBrans([]);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      // toastMessage.error(errorMessage);
      setBrans([]);
    } finally {
      setBrandLoading(false);
    }
  };
  const fetchRevenuePerformance = async (value: string = "7") => {
    setRevenueLoading(true);
    try {
      const response = await getRevenuePerformance(value || "7");
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
  const getInstagramView: (channels: IFollowers[]) => string = (
    channels: IFollowers[]
  ) => {
    let instagram = channels.find(
      (ele: { channelType: string }) => ele.channelType === "instagram"
    );
    return instagram ? formatNumber(instagram?.followers) : "-";
  };
  const getYoutubeView: (channels: IFollowers[]) => string = (
    channels: IFollowers[]
  ) => {
    let youtube = channels.find(
      (ele: { channelType: string }) => ele.channelType === "youtube"
    );
    return youtube ? formatNumber(youtube?.followers) : "-";
  };
  return (
    <div className="flex flex-col gap-4 md:p-4 p-2 w-full">
      {mainLoading && <Loader />}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 md:grid-cols-3 gap-2 rounded-[20px] w-full">
        <StatsCard
          title={translate("Followers")}
          value={
            <div className="flex gap-2 justify-center">
              <div className="flex space-x-2 items-center p-2">
                <div>
                  <img
                    src="/assets/creator/Instagram-icon.svg"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-sm">
                  {getInstagramView(statesInfo?.followers)}
                </p>
              </div>
              <div className="flex space-x-2 items-center p-2">
                <div>
                  <img
                    src="/assets/creator/Youtube-icon.svg"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-sm">
                  {getYoutubeView(statesInfo?.followers)}
                </p>
              </div>
            </div>
          }
          growth={5}
          bgColor="bg-white bg-[#f2f1fd]"
          borderColor={"border-[#7877EE]"}
        />
        <StatsCard
          title={translate("Pending_Collaboration")}
          value={formatNumber(statesInfo?.pendingCollaborations)}
          growth={5}
          borderColor="border-[#C861A0]"
          bgColor="bg-[#faeff6]"
          link="/creator/collaboration?status=PENDING"
        />
        <StatsCard
          title={translate("Conversion_Rate")}
          value={`${formatFloatValue(statesInfo?.conversionRate)} %`}
          growth={5}
          borderColor="border-[#EB815B]"
          bgColor="bg-[#fdf2ef]"
        />
        <StatsCard
          title={translate("Orders")}
          value={formatNumber(statesInfo?.totalOrders)}
          growth={5}
          borderColor="border-[#77EE8D]"
          bgColor="bg-[#f1fdf4]"
        />
        <StatsCard
          title={translate("Revenue")}
          value={`${formatNumber(statesInfo?.totalRevenue)}`}
          icon={<IndianRupee size={27} />}
          growth={5}
          borderColor="border-[#EB815B]"
          bgColor="bg-[#fdf2ef]"
        />
        <StatsCard
          title={translate("Commission")}
          value={`${formatNumber(statesInfo?.totalCommission)}`}
          icon={<IndianRupee size={27} />}
          growth={5}
          borderColor="border-[#9773C8]"
          bgColor="bg-[#f5f1fa]"
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
                  <div className="">
                    <EmptyPlaceHolder
                      title={"No Revenue Found"}
                      description="Revenue Performance will be displayed here once activity data is available. Encourage users to participate to see leaderboard ranking."
                    />
                  </div>
                )}
              </div>
              <div className="flex xl:w-[35%] md:w-[50%] w-full">
                {productLoading ? (
                  <div className="w-full bg-white rounded-lg">
                    <Loading height="fit" />
                  </div>
                ) : products?.length > 0 ? (
                  <DonutChart data={products} />
                ) : (
                  <EmptyPlaceHolder
                    title="No Product Update"
                    description="Product Updates will be displayed here once activity data is available. Encourage users to participate to see leaderboard ranking."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right block: MostSellingBrands */}
          <div className="flex-1 w-full flex">
            <TopBrands data={brands} loading={brandLoading} />
          </div>
        </div>

        {/* Row 2: RecentActivities */}
        <div className="w-full flex">
          <RecentCollaborations />
        </div>
      </div>
    </div>
  );
}
