"use client";
import Loading from "@/app/vendor/loading";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { translate } from "@/lib/utils/translate";
import axios from "@/lib/web-api/axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";

interface ITopCreator {
  activeCollaborationCount: number;
  percentage: number;
  name?: string;
  _id: string;
}

const MostSellingBrands = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ITopCreator[]>([]);
  // Get Creator list
  const fetchTopCreators = async () => {
    try {
      const response = await axios.get(
        `/auth/vendor-dashboard/top-performing-creators?page=${1}&limit=${10}`
      );

      if (response?.data?.status === 200) {
        setData(response?.data?.data);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTopCreators();
  }, []);
  return (
    <div className="p-5 w-full bg-white rounded-xl h-full flex-1 overflow-hidden">
      {loading ? (
        <div className="absolute top-0 bottom-0 right-0 left-0 z-[999] flex justify-center items-center bg-white/50">
          <Loading height="fit" />
        </div>
      ) : null}
      <h3 className="md:text-xl text-base text-text font-medium mb-3">
        {translate("Top_Creators")}
      </h3>
      {data?.length > 0 ? (
        <ul className="space-y-4">
          {data.map((item, index) => (
            <li key={index} className="flex flex-col">
              <div className="flex justify-between items-center gap-2">
                <span className="text-font-grey md:text-base text-sm ">
                  {item?.name || "Creator"}{" "}
                  <span className="text-black">
                    ({item.activeCollaborationCount})
                  </span>
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
      ) : (
        <div className="space-y-4 flex justify-center items-center h-full">
          <EmptyPlaceHolder
            title={"No_Top_Creators_Yet"}
            description={
              "Top_creators_will_be_displayed_here_once_activity_data_is_available._Encourage_users_to_participate_to_see_leaderboard_ranking."
            }
          />
        </div>
      )}
    </div>
  );
};

export default MostSellingBrands;
