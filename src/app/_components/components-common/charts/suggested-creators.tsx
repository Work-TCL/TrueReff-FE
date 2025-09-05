"use client";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import SuggestedCreators from "../suggested-creator";

const DonutChart = (props: { data?: any[] }) => {
  const translate = useTranslations();
  const data = props?.data ?? [
    { name: translate("Most_selling_products"), value: 76, color: "#BEDBFC" },
    { name: translate("Low-Performing_products"), value: 24, color: "#FED6AF" },
  ];
  return (
    <div className="w-full p-4 rounded-20 bg-white h-full flex-1">
      <h2 className=" text-text text-xl font-semibold">
        {translate("Suggested_Creators")}
      </h2>
      <div className=" relative h-[340px] mt-2">
        {/* <ResponsiveContainer width="100%" height={"100%"}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              style={{ width: "100%", height: "100%" }}
              innerRadius={75}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              paddingAngle={7}
              cornerRadius={7}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-desc">{translate("This_month")}</p>
          <p className="text-2xl font-medium text-gray-darken">{formatNumber(data?.reduce((total:any, item:any) => total + item?.value,
              0))}</p>
        </div> */}
        <SuggestedCreators data={data} />
      </div>

      {/* <div className="flex flex-col gap-3 mt-4 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            ></div>
            <span>
              {item.name} <b className='font-medium'>{item.value}%</b>
            </span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default DonutChart;
