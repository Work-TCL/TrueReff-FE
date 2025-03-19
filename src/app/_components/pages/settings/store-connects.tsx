"use client";
import React from "react";
import ShopifyStoreConnects from "./components/shopify-connect-form";
import Link from "next/link";
import { translate } from "@/lib/utils/translate";

export default async function StoreConnects({ channels = [] }: any) {
  return (
    <div className="flex flex-col w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-2 shadow-md">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-sm xl:text-lg font-semibold">
          {Array.isArray(channels) && channels.length > 0
            ? translate("channels_connected")
            : translate("store_integration")}
        </h2>
      </div>
      {Array.isArray(channels) && channels.length > 0 ? (
        channels?.map((value, index, array) => {
          return (
            <div
              key={index}
              className="flex flex-col w-full xl:max-w-[320px] border border-gray-300 rounded-xl p-4 xl:p-5 gap-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm xl:text-lg font-semibold">
                  {value?.channelType}
                </span>

                <span className="bg-[#FFEDF2] text-primary text-[10px] xl:text-xs px-3 py-1 rounded-2xl">
                  {value?.channelStatus}
                </span>
              </div>

              <div className="flex flex-col text-[14px] xl:text-[16px] text-gray-500">
                <Link
                  href={`https://${value?.channelConfig?.domain}`}
                  target="_blank"
                  className="text-sm hover:underline hover:text-blue-600"
                >
                  {value?.channelConfig?.domain}
                </Link>
                <span className="text-base pt-1">
                  {value?.channelConfig?.name}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <ShopifyStoreConnects />
      )}
    </div>
  );
}
