"use client";

import { translate } from "@/lib/utils/translate";
import React from "react";

const data = [
  { name: "Zara", percentage: 70 },
  { name: "H & M", percentage: 35 },
  { name: "Puma", percentage: 60 },
  { name: "Nike", percentage: 80 },
  { name: "Adidas", percentage: 50 },
  { name: "Campus", percentage: 45 },
  { name: "Michel Kaur", percentage: 90 },
  { name: "Nike", percentage: 80 },
  { name: "Adidas", percentage: 50 },
  { name: "Campus", percentage: 45 },
];

const MostSellingBrands = () => {
  return (
    <div className="w-full p-4 bg-white rounded-2xl">
      <h3 className="md:text-xl text-base text-text font-medium mb-3">
        {translate("Most_Selling_Brands")}
      </h3>
      <ul className="space-y-4">
        {data.map((item, index) => (
          <li key={index} className="flex flex-col">
            <div className="flex justify-between items-center gap-2">
              <span className="text-font-grey md:text-base text-sm ">
                {item.name}
              </span>
              <span className="text-primary md:text-base text-sm">
                {item.percentage}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="relative flex-grow h-[6px] bg-stroke rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-secondary rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostSellingBrands;
