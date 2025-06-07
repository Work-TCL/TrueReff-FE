"use client";
import { StatsCard } from "@/app/_components/components-common/states/StatesCard";
import { useTranslations } from "next-intl";
import React from "react";
import AnalyticsTable from "./analytics-table";
import {
  IAnalyticsData,
  IFilterAnalytics,
  IModes,
  IStatesOptions,
} from "./types";

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
  onRowClick: (value: IFilterAnalytics) => void;
  clearFilter: () => void;
  filter: IFilterAnalytics | null;
  mode: IModes;
}

function AnyalyticsCombineUI({
  states = [],
  onRowClick,
  clearFilter,
  filter,
  mode,
}: IProps) {
  const t = useTranslations();

  const getStateAnalytics = (card: IStatesOptions, index: number) => {
    const colors = colorMap[index] || {
      bgColor: "bg-white",
      borderColor: "border-gray-300",
    };

    return (
      <StatsCard
        key={index}
        title={t(card.key)}
        value={card.value}
        bgColor={colors.bgColor}
        borderColor={colors.borderColor}
        growth={5}
      />
    );
  };

  const sampleAnalyticsData: IAnalyticsData[] = [
    {
      brand: {
        name: "GlowBee",
        logo: "/images/brands/glowbee.png",
        _id: "4987984514561561",
      },
      product: {
        _id: "p3",
        title: "Vitamin C Serum",
        image: "/images/products/serum.jpg",
      },
      orders: 210,
      revenue: 130000,
      visitors: 1500,
      salesGraphData: [30, 35, 40, 38, 45, 42, 50],
    },
    {
      brand: {
        name: "NutriPro",
        logo: "/images/brands/nutripro.png",
        _id: "9894589484798475616",
      },
      product: {
        _id: "p4",
        title: "Energy Bites",
        image: "/images/products/energy.jpg",
      },
      orders: 150,
      revenue: 95000,
      visitors: 1200,
      salesGraphData: [20, 28, 25, 30, 33, 31, 40],
    },
  ];

  return (
    <div>
      {/* states of all creators | one creator | product */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-4 col-span-3">
        {states.map(getStateAnalytics)}
      </div>

      {filter && (
        <div className="p-5 border rounded-lg">
          Active {filter.key}{" "}
          <span
            className="cursor-pointer border rounded-md bg-white text-sm p-2"
            onClick={clearFilter}
          >
            Clear Filter
          </span>
        </div>
      )}

      {/* data-table */}
      <div>
        <AnalyticsTable
          key={filter?.key || "ALL"}
          mode={mode}
          filter={filter}
          data={sampleAnalyticsData}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );
}

export default AnyalyticsCombineUI;
