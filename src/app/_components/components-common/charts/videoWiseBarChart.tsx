import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/utils/translate";
import { Button } from "@/components/ui/button";

const data = [
  { day: "Mon", views: 50, revenue: 90, conversions: 30 },
  { day: "Tue", views: 80, revenue: 95, conversions: 50 },
  { day: "Wed", views: 60, revenue: 40, conversions: 20 },
  { day: "Thu", views: 90, revenue: 50, conversions: 10 },
  { day: "Fri", views: 70, revenue: 60, conversions: 40 },
  { day: "Sat", views: 75, revenue: 95, conversions: 5 },
  { day: "Sun", views: 80, revenue: 90, conversions: 45 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
    payload: { day: string };
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-md shadow-md border border-gray-200">
        <p className="text-xs font-semibold">{payload[0].payload.day}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VideoWiseRevenueChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Video-Wise Revenue</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="text-gray-700 bg-gray-100 px-3 py-0 text-sm rounded-md">
              {translate("Yearly")} ▼
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem>{translate("This_week")}</DropdownMenuItem>
            <DropdownMenuItem>{translate("Last_week")}</DropdownMenuItem>
            <DropdownMenuItem>{translate("This_month")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
          <Bar
            dataKey="views"
            fill="#AEE5C5"
            radius={[4, 4, 0, 0]}
            name="Views"
          />
          <Bar
            dataKey="revenue"
            fill="#FED6AF"
            radius={[4, 4, 0, 0]}
            name="Revenue"
          />
          <Bar
            dataKey="conversions"
            fill="#BEDBFC"
            radius={[4, 4, 0, 0]}
            name="Conversions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VideoWiseRevenueChart;
