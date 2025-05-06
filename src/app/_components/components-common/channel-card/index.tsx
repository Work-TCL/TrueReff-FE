"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Confirmation from "../dialogs/confirmation-dialog";
import toast from "react-hot-toast";

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
  const [confirm, setConfirm] = useState<boolean>(false)
  const handleConfirm = () => {
    setConfirm(false);
  }
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

  return <>{href ? (
    <div
      onClick={(e) => {
        e.stopPropagation();
        router?.push(href);
      }}
      key={channelType}
      className="relative group flex flex-col w-full xl:max-w-[320px] border border-gray-300 rounded-xl p-4 xl:p-5 gap-3 bg-white cursor-pointer"
    >
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center justify-center p-1 bg-gray-100 rounded-full hover:bg-gray-200" onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push("/vendor/settings/store")
      }}>
        <Pencil className="w-4 h-4 text-gray-600" />
      </div>
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
      <div>
        <Button className="text-white" variant="secondary" onClick={() => toast.success("Coming soon!")}>Deactivate</Button>
      </div>
    </div>
  )}
    {confirm && <Confirmation loading={false} title="Are you sure you want to deactivate this store?" handleConfirm={handleConfirm} onClose={() => setConfirm(false)} />}
  </>
}
