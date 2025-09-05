"use client";
import { IRevenueData } from "@/lib/types-api/creator-dashboard";
import { formatNumber } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// Provided data
const rawData = {
  current: [
    {
      date: "2025-05-19",
      totalRevenue: 10,
    },
    {
      date: "2025-05-21",
      totalRevenue: 20,
    },
  ],
  past: [],
};



const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded-lg">
        <p className="text-sm m-0">Current: {formatNumber(Number(payload[0]?.value || 0))}</p>
        <p className="text-sm m-0">Past: {formatNumber(Number(payload[1]?.value || 0))}</p>
        <p className="text-xs m-0">{label}</p>
      </div>
    );
  }
  return null;
};

export default function SalesChart(props: {data?: IRevenueData}) {
  const translate = useTranslations();
  const data = props?.data??{
    current: [],
    past:[]
  }
  const totalCurrentRevenue = (data??{current:[]}).current.reduce(
    (total, item) => total + item.totalRevenue,
    0
  );
  return (
    <div className="w-full bg-white p-2 md:p-4 rounded-20 h-full flex-1">
      <div className="flex md:flex-row flex-col justify-between md:items-center items-start">
        <h3 className="md:text-xl text-base font-semibold whitespace-nowrap text-text">
          {translate("Revenue")}
        </h3>
        {/* <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-font-grey text-sm font-medium">
              {translate("Current")}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-black rounded-full"></span>
            <span className="text-font-grey text-sm font-medium">
              {translate("Past")}
            </span>
          </div>
        </div> */}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={[...data?.current,...data?.past]} margin={{ top: 26 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F5" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#7E7E80", fontSize: 12 }}
            stroke="#F2F4F5"
          />
          <YAxis
            tick={{ fill: "#7E7E80", fontSize: 12 }}
            stroke="#F2F4F5"
            strokeWidth={0}
            tickFormatter={formatNumber}
          />
          <Tooltip content={<CustomTooltip />} formatter={(value) => formatNumber(Number(value))} />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#FF4979" // Red line for current data
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="past"
            stroke="#090919" // Black line for past data
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}