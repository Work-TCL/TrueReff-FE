"use client";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import SuggestedProductUI from "../suggested-product";

const SuggestedProducts = (props: { data?: any[] }) => {
  const translate = useTranslations();
  const data = props?.data ?? [
    { name: translate("Most_selling_products"), value: 76, color: "#BEDBFC" },
    { name: translate("Low-Performing_products"), value: 24, color: "#FED6AF" },
  ];
  return (
    <div className="w-full p-4 rounded-20 bg-white h-full flex-1">
      <h2 className=" text-text text-xl font-semibold">
        {translate("Suggested_Products")}
      </h2>
      <div className=" relative h-[320px] mt-2">
        <SuggestedProductUI data={data} />
      </div>
    </div>
  );
};

export default SuggestedProducts;
