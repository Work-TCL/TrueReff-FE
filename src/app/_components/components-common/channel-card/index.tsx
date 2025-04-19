"use client";
import { IChannel } from "@/lib/types-api/vendor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface IChannelCard {
  href?: string;
  channelType: string;
  channelStatus: string;
  channelConfig: {
    name: string;
    domain: string;
  };
}

export default function ChannelCard({
  channelType,
  channelStatus,
  channelConfig,
  href = "",
}: IChannelCard) {
  const router = useRouter();
  const headerContent = () => (
    <div className="flex items-center gap-4">
      <span className="text-sm xl:text-lg font-semibold">{channelType}</span>
      <span className="bg-[#FFEDF2] text-primary text-[10px] xl:text-xs px-3 py-1 rounded-2xl">
        {channelStatus}
      </span>
    </div>
  );

  const bodyContent = () => (
    <div className="flex flex-col text-[14px] xl:text-[16px] text-gray-500">
      <div
        onClick={(e) => {
          e.stopPropagation(); // 🔥 Prevents parent onClick

          typeof window !== undefined &&
            window.open(
              `https://${channelConfig?.domain}`,
              "_blank",
              "noopener,noreferrer"
            );
        }}
        className="text-sm hover:underline hover:text-blue-600 cursor-pointer"
      >
        {channelConfig?.domain}
      </div>
      <span className="text-base pt-1">{channelConfig?.name}</span>
    </div>
  );

  return href ? (
    <div
      onClick={() => {
        router?.push(href);
      }}
      key={channelType}
      className="flex flex-col w-full xl:max-w-[320px] border border-gray-300 rounded-xl p-4 xl:p-5 gap-3 bg-white cursor-pointer"
    >
      {headerContent()}
      {bodyContent()}
    </div>
  ) : (
    <div
      key={channelType}
      className="flex flex-col w-full xl:max-w-[320px] border border-gray-300 rounded-xl p-4 xl:p-5 gap-3 bg-white"
    >
      {headerContent()}
      {bodyContent()}
    </div>
  );
}
