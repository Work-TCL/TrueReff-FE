"use client";
import React from "react";
import ChannelsConnectSocial from "./instagram-connect";
import { useTranslations } from "next-intl";

interface IStoreConnects {
  className?: string;
}

export default function ChannelConnects({ className = "" }: IStoreConnects) {
  const translate = useTranslations();
  return (
    <div
      className={`flex flex-col w-full h-full rounded-xl p-4 gap-2 ${className}`}
    >
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-sm xl:text-lg font-semibold capitalize">
          {translate("channels_connect")}
        </h2>
      </div>
      <ChannelsConnectSocial />
    </div>
  );
}
