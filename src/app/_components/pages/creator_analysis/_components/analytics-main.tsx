"use client";
import { StatsCard } from "@/app/_components/components-common/states/StatesCard";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
  FILTER_KEYS,
  IAnalyticsData,
  IAnalyticsProduct,
  IFilterAnalytics,
  IModes,
  IStatesOptions,
} from "./types";
import { formatFloatValue, formatNumber } from "@/lib/utils/constants";
import { getAnalyticsColumns } from "./getAnalyticsColumns";
import DataTable from "@/app/_components/components-common/data-table";
import { TablePagination } from "@/app/_components/components-common/tables/Pagination";

// Colors assigned by index
const colorMap = [
  { bgColor: "bg-[#f2f1fd]", borderColor: "border-[#7877EE]" },
  { bgColor: "bg-[#fdf2ef]", borderColor: "border-[#EB815B]" },
  { bgColor: "bg-[#f1fdf4]", borderColor: "border-[#77EE8D]" },
  { bgColor: "bg-[#f5f1fa]", borderColor: "border-[#9773C8]" },
  { bgColor: "bg-[#faeff6]", borderColor: "border-[#C861A0]" },
];

interface IProps {
  states: IStatesOptions[];
  onRowClick: (value?: IFilterAnalytics, product?: IAnalyticsProduct) => void;
  clearFilter: (type: "filter" | "product") => void;
  handlePageChange: (page: number) => void;
  filter: IFilterAnalytics | null;
  page: number;
  className: string;
  totalPages: number;
  mode: IModes;
  data: IAnalyticsData[];
  product: IAnalyticsProduct | null;
}

function AnyalyticsCombineUI({
  states = [],
  onRowClick,
  clearFilter,
  filter,
  mode,
  data,
  page,
  totalPages,
  product,
  handlePageChange,
  className,
}: IProps) {
  const t = useTranslations();
  const [columns, setColumns] = useState(() =>
    getAnalyticsColumns(
      t,
      mode,
      handleRowClick,
      filter?.key,
      Boolean(product !== null)
    )
  );

  function handleRowClick(value?: IFilterAnalytics, p?: IAnalyticsProduct) {
    // Remove product column and call API
    console.log("Fetch data for productId", value);
    onRowClick(value, p);
  }

  const getStateAnalytics = (card: IStatesOptions, index: number) => {
    const colors = colorMap[index] || {
      bgColor: "bg-white",
      borderColor: "border-gray-300",
    };

    return (
      <StatsCard
        key={index}
        title={t(card.key)}
        value={formatNumber(card.value)}
        bgColor={colors.bgColor}
        borderColor={colors.borderColor}
        growth={5}
      />
    );
  };

  useEffect(() => {
    setColumns(
      getAnalyticsColumns(
        t,
        mode,
        handleRowClick,
        filter ? filter?.key : undefined,
        Boolean(product !== null)
      )
    ); // Without `onProductClick`, product column gets hidden
  }, [product, filter]);

  return (
    <div className={`flex flex-col w-full gap-5 flex-1 ${className}`}>
      {/* states of all creators | one creator | product */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4 col-span-3">
        {states.map(getStateAnalytics)}
      </div>

      {(filter || product) && (
        <div className="p-5 border rounded-xl bg-white shadow-sm space-y-4">
          <div className="text-sm font-semibold text-gray-700">
            Active Filters
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Filter Card */}
            {filter && (
              <div className="relative flex items-center gap-4 px-4 py-3 bg-sky-50 rounded-xl border border-sky-200 shadow-sm w-fit sm:w-auto sm:flex-[none] flex-1 min-w-[260px]">
                <img
                  src={
                    (filter.key === FILTER_KEYS.CREATOR
                      ? filter.value.creatorImage
                      : filter.value.vendorImage) ||
                    "/assets/profile/profile-image.png"
                  }
                  alt={
                    filter.key === FILTER_KEYS.CREATOR
                      ? filter.value.creatorName
                      : filter.value.vendorName
                  }
                  className="w-12 h-12 rounded-full object-cover border"
                />

                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {filter.key === FILTER_KEYS.CREATOR
                      ? filter.value.creatorName
                      : filter.value.vendorName}
                  </div>
                  <div className="text-xs font-medium text-sky-600 capitalize">
                    {filter.key.toLowerCase()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    clearFilter("filter");
                    setColumns(
                      getAnalyticsColumns(
                        t,
                        mode,
                        handleRowClick,
                        undefined,
                        Boolean(product !== null)
                      )
                    );
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-100 hover:text-red-600 transition text-xs"
                  title="Remove Filter"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Product Card */}
            {product && (
              <div className="relative flex items-center gap-4 px-4 py-3 bg-green-50 rounded-xl border border-green-200 shadow-sm w-fit sm:w-auto sm:flex-[none] flex-1 min-w-[260px]">
                <img
                  src={
                    product.productImage || "/assets/product/image-square.svg"
                  }
                  alt={product.productName}
                  className="w-12 h-12 rounded-md object-cover border"
                />

                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    {product.productName}
                  </div>
                  <div className="text-xs font-medium text-green-600">
                    Product
                  </div>
                </div>

                <button
                  onClick={() => {
                    clearFilter("product");
                    setColumns(
                      getAnalyticsColumns(
                        t,
                        mode,
                        handleRowClick,
                        filter?.key,
                        false
                      )
                    );
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-red-100 hover:text-red-600 transition text-xs"
                  title="Remove Filter"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* data-table */}
      {(filter?.key || product) && !Boolean(data.length > 0) ? (
        <div className="flex-1 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden h-full rounded-xl">
          <div className="flex flex-col items-center justify-center text-center rounded-lg w-full h-full border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
            <div className="flex flex-col items-center">
              <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
                {t("filter_not_found")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
                {t("filter_not_found_desc")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
      <TablePagination
        totalPages={totalPages}
        activePage={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AnyalyticsCombineUI;
