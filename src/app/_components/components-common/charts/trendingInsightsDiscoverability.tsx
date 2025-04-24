"use client";

import { translate } from "@/lib/utils/translate";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TrendingInsightsDiscoverability: React.FC = () => {
  const data = [
    { name: "Beauty", value: 40, color: "#C45DD4" },
    { name: "Fashion", value: 40, color: "#5AC85A" },
    { name: "Electronics", value: 15, color: "#F89C43" },
    { name: "Other", value: 5, color: "#6A65FF" },
  ];

  return (
    <div className="w-full h-full p-5 bg-white rounded-lg shadow-sm ">
      <h2 className="md:text-xl text-base font-semibold text-gray-900 whitespace-nowrap mb-4">
        {translate("Trending_Insights_Discoverability")}
      </h2>
      <div className="flex sm:flex-row flex-col items-center gap-3 h-full">
        <div className="relative h-[160px] flex justify-center items-center flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                paddingAngle={5}
                cornerRadius={5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 flex-1 w-full  ">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-700 text-sm">{item.name}</span>
              </div>
              <span className="text-gray-900 text-sm font-medium">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingInsightsDiscoverability;
