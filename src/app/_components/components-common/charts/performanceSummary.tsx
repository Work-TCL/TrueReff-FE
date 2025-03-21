"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/utils/translate";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", earnings: 120000, followers1: 80000 },
  { month: "Feb", earnings: 500000, followers1: 350000 },
  { month: "Mar", earnings: 200000, followers1: 150000 },
  { month: "Apr", earnings: 400000, followers1: 300000 },
  { month: "May", earnings: 100000, followers1: 70000, followers: 70000 },
  { month: "Jun", earnings: 600000, followers: 400000 },
  { month: "Jul", earnings: 450000, followers: 250000 },
  { month: "Aug", earnings: 520000, followers: 300000 },
  { month: "Sep", earnings: 380000, followers: 200000 },
  { month: "Oct", earnings: 650000, followers: 450000 },
  { month: "Nov", earnings: 500000, followers: 300000 },
  { month: "Dec", earnings: 200000, followers: 150000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 rounded-lg text-xs shadow-md">
        <p className="font-semibold">${payload[0].value.toLocaleString()}</p>
        <p className="text-gray-300">{label}</p>
      </div>
    );
  }
  return null;
};

export default function PerformanceSummaryChartDashBoard() {
  return (
    <div className="w-full h-full bg-white p-6 rounded-2xl shadow-md">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col justify-between items-center mb-4">
        <p className="text-lg font-semibold whitespace-nowrap">
          {translate("Performance Summary")}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 shrink-0 bg-[#7877EE] rounded-full"></span>
            <span className="text-gray-600 text-sm whitespace-nowrap    ">
              {translate("Earnings ($)")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 shrink-0 bg-black rounded-full"></span>
            <span className="text-gray-600 text-sm">
              {translate("Followers")}
            </span>
          </div>
          {/* Dropdown for Time Range */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="text-gray-700 bg-gray-100 px-3 py-0 text-sm rounded-md">
                {translate("Yearly")} ▼
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{translate("This Week")}</DropdownMenuItem>
              <DropdownMenuItem>{translate("Last Week")}</DropdownMenuItem>
              <DropdownMenuItem>{translate("This Month")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="month"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} stroke="#E5E7EB" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#6366F1"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="#000"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="followers1"
            stroke="#000"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
