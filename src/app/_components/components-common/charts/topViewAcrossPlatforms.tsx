"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TopViewAcrossPlatforms: React.FC = () => {
  const data = [
    { name: "YouTube", value: 45, color: "#FF8E80" },
    { name: "Instagram", value: 45, color: "#808EFF" },
    { name: "Website", value: 99, color: "#FFE982" },
    { name: "TikTok", value: 55, color: "#FFBD80" },
  ];

  return (
    <div className="w-full p-5 bg-white rounded-xl h-full">
      <h2 className="sm:text-xl text-base font-semibold text-gray-900 whitespace-nowrap">
        Top Views across Platforms
      </h2>
      <div className="flex sm:flex-row flex-col items-center gap-3 h-full lg:pt-0 pt-2">
        <div className="relative h-[200px] flex justify-center items-center flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                style={{ width: "100%", height: "100%" }}
                innerRadius={80}
                outerRadius={95}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                paddingAngle={5}
                cornerRadius={6}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-5 flex-1 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-font-grey font-medium">{item.name}</span>
              </div>
              <span className="text-gray-black font-medium">{item.value}K</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopViewAcrossPlatforms;
