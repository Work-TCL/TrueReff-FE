"use client";

import Loading from "@/app/creator/loading";
import { ITopBrands } from "@/lib/types-api/creator-dashboard";
import React from "react";
import { EmptyPlaceHolder } from "../../ui/empty-place-holder";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  formatFloatValue,
  formatNumber,
} from "@/lib/utils/constants";
import { IndianRupee } from "lucide-react";
interface ITopBrandsProps {
  data: ITopBrands[];
  loading: boolean;
}
const TopBrands = ({ data, loading }: ITopBrandsProps) => {
  const translate = useTranslations();
  return (
    <div className="flex flex-col flex-1 w-full p-3 md:p-4 bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="md:text-xl text-base text-text font-semibold">
            {data?.length > 0 ? translate("Top_Brands"):''}
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
      {loading ? (
        <Loading height="fit" />
      ) : data?.length > 0 ? (
        <ul className="space-y-4">
          {data.map((item: ITopBrands, index: any) => (
            <li key={index} className="flex flex-col gap-1">
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <Image
                    src={
                      item?.profile_image
                        ? item?.profile_image
                        : "/assets/profile/profile-image.png"
                    }
                    alt={"profile"}
                    width={25}
                    height={50}
                    className="rounded-[50%]"
                  />
                  <span className="text-font-grey flex items-center gap-1">
                    <span>{item.business_name}</span>
                    <span className="text-secondary flex items-center">
                      {" - "}
                      <IndianRupee size={15} />
                      {`${formatNumber(item.revenue)}`}
                    </span>
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary">{formatFloatValue(item.percentage)}%</span>
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
        </ul>
      ) : (
        <div className="space-y-4 flex justify-center items-center h-full">
          <EmptyPlaceHolder
            title={translate("No_Top_Brands_Yet")}
            description={translate("No_Top_Brands_Yet_dec")}
          />
        </div>
      )}
    </div>
  );
};

export default TopBrands;
