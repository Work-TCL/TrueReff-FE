"use client";
import React, { useEffect, useState } from "react";
import AnyalyticsCombineUI from "./_components/analytics-main";
import {
  FILTER_KEYS,
  IAnalyticsBrandData,
  IAnalyticsCreatorData,
  IAnalyticsData,
  IAnalyticsProduct,
  IAnalyticsProductData,
  IFilterAnalytics,
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
import { useTranslations } from "next-intl";
import { Subject } from "rxjs";

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
export const HandleSearchProduct = new Subject<IAnalyticsProductData>();
export const HandleSearchBrand = new Subject<IAnalyticsBrandData>();
export const HandleSearchCreator = new Subject<IAnalyticsCreatorData>();
export const AnalyticsDaysFilter = new Subject<string>();

export default function CombineAnalytics({ mode }: IProps) {
  const t = useTranslations();
  const [filter, setFilter] = useState<IFilterAnalytics | null>(null);
  const [product, setProduct] = useState<IAnalyticsProduct | null>(null);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(1);
  const [list, setList] = useState<IAnalyticsData[]>([]);
  const [isStatesLoading, setIsStatesLoading] = useState<boolean>(false);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [days, setDays] = useState<string>("");
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
        ...(days ? { days: days } : {}),
      };

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.vendorId = filter.value.vendorId;
      }
      if (product) {
        payload.productId = product.productId;
      }

      const response = await getAnalyticsCreatorsList({ ...payload });
      setCount(response.count);
      setList(response.list);
    } catch (error) {
    } finally {
      setIsListLoading(false);
    }
  };
  const fetchCreatorsStates = async () => {
    if (mode !== "creator") return;
    setIsStatesLoading(true);
    try {
      const payload: IGETCreatorsStateRequest = {
        ...(days ? { days: days } : {}),
      };

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.vendorId = filter.value.vendorId;
      }
      if (product) {
        payload.productId = product.productId;
      }
      const response = await getAnalyticsCreatorsState(payload);
      setStates(response);
    } catch (error) {
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
        ...(days ? { days: days } : {}),
      };

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.creatorId = filter.value.creatorId;
      }
      if (product) {
        payload.productId = product.productId;
      }

      const response = await getAnalyticsVendorsList({ ...payload });
      setCount(response.count);
      setList(response.list);
    } catch (error) {
    } finally {
      setIsListLoading(false);
    }
  };

  const fetchVendorStates = async () => {
    if (mode !== "vendor") return;
    setIsStatesLoading(true);
    try {
      const payload: IGETVendorsStateRequest = {
        ...(days ? { days: days } : {}),
      };

      if (filter && filter.key === FILTER_KEYS.VENDOR) {
        payload.creatorId = filter.value.creatorId;
      }
      if (product) {
        payload.productId = product.productId;
      }
      const response = await getAnalyticsVendorsState({ ...payload });
      setStates(response);
    } catch (error) {
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
    const subscriptionProduct = HandleSearchProduct.subscribe(
      (value: IAnalyticsProductData) => {
        handleOnSearchProduct(value);
      }
    );
    const subscriptionBrand = HandleSearchBrand.subscribe(
      (value: IAnalyticsBrandData) => {
        handleOnSearchVendor(value);
      }
    );
    const subscriptionCreator = HandleSearchCreator.subscribe(
      (value: IAnalyticsCreatorData) => {
        handleOnSearchCreator(value);
      }
    );

    const subscriptionAnaytics = AnalyticsDaysFilter.subscribe(
      (val: string) => {
        setDays(val == "all" ? "" : val);
      }
    );

    return () => {
      subscriptionProduct.unsubscribe();
      subscriptionBrand.unsubscribe();
      subscriptionCreator.unsubscribe();
      subscriptionAnaytics.unsubscribe();
    };
  }, []);

  useEffect(() => {
    (async () => {
      await fetchCreatorsStates();
      await fetchVendorStates();
      await fetchCreatorList(1);
      await fetchVendorList(1);
    })();
  }, [filter, product, days]);

  const handleOnSearchVendor = (vendor: IAnalyticsBrandData) => {
    setPage(1);
    setFilter({
      key: FILTER_KEYS.VENDOR,
      //@ts-ignore
      value: {
        _id: "",
        vendorId: vendor._id,
        vendorName: vendor.business_name,
        vendorImage: vendor.profile_image,
      },
    });
    fetchCreatorList(1);
  };
  const handleOnSearchCreator = (creator: IAnalyticsCreatorData) => {
    setPage(1);
    setFilter({
      key: FILTER_KEYS.CREATOR,
      //@ts-ignore
      value: {
        _id: "",
        creatorId: creator._id,
        creatorName: creator.name,
        creatorImage: creator.profile_image,
      },
    });
    fetchVendorList(1);
  };
  const handleOnSearchProduct = (product: IAnalyticsProductData) => {
    setPage(1);
    setProduct({
      productId: product._id,
      productImage: product.media.length > 0 ? product.media[0] : "",
      productName: product.title,
    });
    fetchCreatorList(1);
  };

  return (
    <div className="h-full relative md:p-4 p-2 flex flex-col overflow-auto">
      {(isStatesLoading || isListLoading) && (
        <Loading isTransparent={true} height="fit" />
      )}
      <AnyalyticsCombineUI
        className={""}
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
        isLoading={isListLoading}
        totalPages={Math.ceil(count / limit)}
      />
    </div>
  );
}
