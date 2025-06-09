"use client";
import React, { useEffect, useState } from "react";
import AnyalyticsCombineUI from "./_components/analytics-main";
import {
  FILTER_KEYS,
  IAnalyticsData,
  IAnalyticsProduct,
  IFilterAnalytics,
  IModes,
  IStatesAnalytics,
} from "./_components/types";
import {
  getAnalyticsCreatorsList,
  getAnalyticsCreatorsState,
  getAnalyticsVendorsList,
  getAnalyticsVendorsState,
  IGETCreatorsRequest,
  IGETCreatorsStateRequest,
  IGETVendorsRequest,
  IGETVendorsStateRequest,
} from "@/lib/web-api/analytics";
import Loading from "@/app/creator/loading";

const getStatesAsNeed = (
  states: IStatesAnalytics = {
    totalOrders: 120,
    totalRevenue: 200,
    totalViews: 200,
    totalCollaborations: 200,
    conversionRate: 200,
  },
  vendorId?: string | undefined,
  creatorId?: string | undefined,
  productId?: string | undefined
) => {
  if (creatorId || productId || vendorId) {
    return [
      { key: "Sales", value: states.totalOrders },
      { key: "Revenue", value: states.totalRevenue },
      { key: "Visitors", value: states.totalViews },
      { key: "Collaborations", value: states.totalCollaborations },
      { key: "Commissions", value: states.conversionRate },
    ];
  }
  return [
    { key: "Total_Sales", value: states.totalOrders },
    { key: "Total_Revenue", value: states.totalRevenue },
    { key: "Total_Visitors", value: states.totalViews },
    { key: "Total_Collaborations", value: states.totalCollaborations },
    { key: "Total_Commission", value: states.conversionRate },
  ];
};

interface IProps {
  mode: "creator" | "vendor";
}

const limit = 10;

export default function CombineAnalytics({ mode }: IProps) {
  const [filter, setFilter] = useState<IFilterAnalytics | null>(null);
  const [product, setProduct] = useState<IAnalyticsProduct | null>(null);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [list, setList] = useState<IAnalyticsData[]>([]);
  const [isStatesLoading, setIsStatesLoading] = useState<boolean>(false);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [states, setStates] = useState<IStatesAnalytics>({
    totalOrders: 0,
    totalRevenue: 0,
    totalViews: 0,
    totalCollaborations: 0,
    conversionRate: 0,
  });

  const handleRowClick = (
    value?: IFilterAnalytics,
    product?: IAnalyticsProduct
  ) => {
    if (value) setFilter(value);
    if (product) setProduct(product);
    setPage(1);
  };

  const clearFilter = (type: "filter" | "product") => {
    if (type === "filter") setFilter(null);
    if (type === "product") setProduct(null);
    setPage(1);
  };

  // Creator-side
  const fetchCreatorList = async (p?: number) => {
    if (mode !== "creator") return;
    setIsListLoading(true);
    try {
      const payload: IGETCreatorsRequest = {
        page: p || page,
        limit,
      };

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.vendorId = filter.value.vendorId;
      }
      if (product) {
        payload.productId = product.productId;
      }

      const response = await getAnalyticsCreatorsList({ ...payload });
      // console.log("response --------->>", response);
      setCount(response.count);
      setList(response.list);
    } catch (error) {
      console.log("while getting vendor list");
    } finally {
      setIsListLoading(false);
    }
  };
  const fetchCreatorsStates = async () => {
    if (mode !== "creator") return;
    setIsStatesLoading(true);
    try {
      const payload: IGETCreatorsStateRequest = {};

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.vendorId = filter.value.vendorId;
      }
      if (product) {
        payload.productId = product.productId;
      }
      const response = await getAnalyticsCreatorsState(payload);
      console.log("response ------212312--->>", response);
      setStates(response);
      // setList(response.list);
    } catch (error) {
      console.log("while getting vendor list");
    } finally {
      setIsStatesLoading(false);
    }
  };

  // Vendor-side
  const fetchVendorList = async (p?: number) => {
    if (mode !== "vendor") return;
    setIsListLoading(true);
    try {
      const payload: IGETVendorsRequest = {
        page: p || page,
        limit,
      };

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.creatorId = filter.value.creatorId;
      }
      if (product) {
        payload.productId = product.productId;
      }

      const response = await getAnalyticsVendorsList({ ...payload });
      // console.log("response --------->>", response);
      setCount(response.count);
      setList(response.list);
    } catch (error) {
      console.log("while getting vendor list");
    } finally {
      setIsListLoading(false);
    }
  };

  const fetchVendorStates = async () => {
    if (mode !== "vendor") return;
    setIsStatesLoading(true);
    try {
      const payload: IGETVendorsStateRequest = {};

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.creatorId = filter.value.creatorId;
      }
      if (product) {
        payload.productId = product.productId;
      }
      const response = await getAnalyticsVendorsState({ ...product });
      console.log("response ------212312--->>", response);
      setStates(response);
      // setList(response.list);
    } catch (error) {
      console.log("while getting vendor list");
    } finally {
      setIsStatesLoading(false);
    }
  };

  // Utils
  const handlePageChange = async (p: number) => {
    setPage(p);
    await fetchCreatorList(p);
    await fetchVendorList(p);
  };

  useEffect(() => {
    (async () => {
      await fetchCreatorsStates();
      await fetchVendorStates();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchCreatorsStates();
      await fetchVendorStates();
      await fetchCreatorList(1);
      await fetchVendorList(1);
    })();
  }, [filter, product]);

  return (
    <div className="h-full relative md:p-6 p-4 flex flex-col">
      {(isStatesLoading || isListLoading) && (
        <Loading isTransparent={true} height="fit" />
      )}
      {/* <div className="flex flex-col gap-4 md:p-6 p-4 w-full relative h-screen overflow-auto"> */}
      <AnyalyticsCombineUI
        states={getStatesAsNeed(
          states,
          //@ts-ignore
          filter && filter?.key === FILTER_KEYS.VENDOR
            ? filter?.value
            : undefined,
          filter && filter.key === FILTER_KEYS.CREATOR
            ? filter.value
            : undefined,
          product ? product.productId : undefined
        )}
        onRowClick={handleRowClick}
        clearFilter={clearFilter}
        handlePageChange={handlePageChange}
        filter={filter}
        product={product}
        mode={mode}
        data={list}
        page={page}
        totalPages={Math.ceil(count / limit)}
      />
      {/* </div> */}
    </div>
  );
}
