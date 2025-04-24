"use client";

import Loading from "@/app/creator/loading";
import { ITopBrands } from "@/lib/types-api/creator-dashboard";
import { translate } from "@/lib/utils/translate";
import React from "react";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
interface ITopBrandsProps {
  data: ITopBrands[];
  loading: boolean
}
const TopBrands = ({data,loading}:ITopBrandsProps) => {
  return (
    <div className="flex flex-col flex-1 w-full p-4 bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-xl text-text font-medium">
            {translate("Top_Brands")}
          </h3>
        </div>
        <div className="hidden gap-3">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-primary rounded-full"></span>
            <span className="text-font-grey text-sm font-medium">
              {translate("Sales")}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-secondary rounded-full"></span>
            <span className="text-font-grey text-sm font-medium">
              {translate("Revenue_S")}
            </span>
          </div>
        </div>
      </div>
      {loading ? <Loading height="fit"/> : data?.length > 0 ? <ul className="space-y-4">
        {data.map((item:ITopBrands, index:any) => (
          <li key={index} className="flex flex-col">
            <div className="flex justify-between items-center gap-2">
              <span className="text-font-grey">{item.business_name}<span className="text-secondary">({item.activeCollaborationCount})</span></span>
              <div className="flex gap-3">
                <span className="text-primary">{item.percentage}%</span>
              </div>
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
      </ul>:<div className="space-y-4 flex justify-center items-center h-full">
                <EmptyPlaceHolder
                  title={"No_Top_Brands_Yet"}
                  description={
                    "Top_brands_will_be_displayed_here_once_activity_data_is_available._Encourage_users_to_participate_to_see_leaderboard_ranking."
                  }
                />
              </div>}
    </div>
  );
};

export default TopBrands;
