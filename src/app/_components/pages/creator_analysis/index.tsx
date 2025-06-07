"use client";
import React, { useState } from "react";
import AnyalyticsCombineUI from "./_components/analytics-main";
import {
  IFilterAnalytics,
  IModes,
  IStatesAnalytics,
} from "./_components/types";

const getStatesAsNeed = (
  states: IStatesAnalytics = {
    sales: 120,
    revenue: 200,
    visitors: 200,
    collobrations: 200,
    commissions: 200,
  },
  vendorId?: string,
  creatorId?: string,
  productId?: string
) => {
  if (creatorId || productId || vendorId) {
    return [
      { key: "Sales", value: states.sales },
      { key: "Revenue", value: states.revenue },
      { key: "Visitors", value: states.visitors },
      { key: "Collaborations", value: states.collobrations },
      { key: "Commissions", value: states.commissions },
    ];
  }
  return [
    { key: "Total_Sales", value: states.sales },
    { key: "Total_Revenue", value: states.revenue },
    { key: "Total_Visitors", value: states.visitors },
    { key: "Total_Collaborations", value: states.collobrations },
    { key: "Total_Commission", value: states.commissions },
  ];
};

interface IProps {}

export default function CreatorAnalysis({}: IProps) {
  const [filter, setFilter] = useState<IFilterAnalytics | null>(null);

  const handleRowClick = (value: IFilterAnalytics) => {
    setFilter(value);
  };

  const clearFilter = () => {
    setFilter(null);
  };

  return (
    <div className="flex flex-col gap-4 md:p-6 p-4 w-full">
      <AnyalyticsCombineUI
        states={getStatesAsNeed()}
        onRowClick={handleRowClick}
        clearFilter={clearFilter}
        filter={filter}
        mode="creator"
      />
    </div>
  );
}
