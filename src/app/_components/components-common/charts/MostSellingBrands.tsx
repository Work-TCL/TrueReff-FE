"use client";
import Loading from "@/app/vendor/loading";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { currency, formatFloatValue, formatNumber } from "@/lib/utils/constants";
import { IndianRupee } from "lucide-react";

interface ITopCreator {
  creatorId: string;
  business_name: string;
  profile_image: string;
  revenue: number;
  percentage: number;
}

const MostSellingBrands = () => {
  const translate = useTranslations();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ITopCreator[]>([]);
  // Get Creator list
  const fetchTopCreators = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/auth/vendor-dashboard/top-performing-creators?page=${1}&limit=${10}`
      );
      if (response?.data?.status === 200) {
        setData(response?.data?.data?.list);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTopCreators();
  }, []);
  return (
    <div className="p-5 w-full bg-white rounded-xl h-full flex-1 overflow-hidden">
      {/* {loading ? (
        <div className="absolute top-0 bottom-0 right-0 left-0 z-[999] flex justify-center items-center bg-white/50">
          <Loading height="fit" />
        </div>
      ) : null} */}
      <h3 className="md:text-xl text-base text-text font-semibold mb-3">
        {data?.length > 0 && translate("Top_Creators")}
      </h3>
      {loading ? (
        // <div className="absolute top-0 bottom-0 right-0 left-0 z-[999] flex justify-center items-center bg-white/50">
          <Loading height="fit" />
        // </div>
      ) : data?.length > 0 ? (
        <ul className="space-y-4">
          {data.map((item, index) => (
            <li key={index} className="flex flex-col gap-1">
              <div className="flex  justify-between items-center gap-2">
                <div className="flex gap-2">
                                   <Image
                                                  src={item?.profile_image?item?.profile_image:"/assets/profile/profile-image.png"}
                                                  alt={"profile"}
                                                  width={25}
                                                  height={50}
                                                  className="rounded-[50%]"
                                                />
                                  <div className="text-font-grey flex items-center space-x-2">
                                   {item.business_name}
                                  <span className="text-secondary flex items-center">
                                    {" - "}<IndianRupee size={15} /> {formatNumber(item.revenue)}
                                  </span>
                                </div></div>
                <span className="text-primary md:text-base text-sm">
                  {formatFloatValue(item.percentage)}%
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
            title={translate("No_Top_Creators_Yet")}
            description={translate("No_Top_Creators_Yet_DESC")}
          />
        </div>
      )}
    </div>
  );
};

export default MostSellingBrands;
