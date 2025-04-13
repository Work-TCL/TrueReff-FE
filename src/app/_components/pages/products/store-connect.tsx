"use client";
import { translate } from "@/lib/utils/translate";
import React from "react";
import AnchorButton from "../../ui/button/variant";
import { Info } from "lucide-react";

export default function StoreConnectsRedirect() {
  return (
    <div className="flex items-center justify-center flex-col min-h-[calc(100vh-90px)] col-span-full text-center text-gray-500 m-4 p-4 bg-white rounded-xl">
      <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white gap-2">
        <Info className="mx-auto text-gray-400" />
        <h2 className="text-lg font-semibold">
          {translate("No_Channels_Available_Title")}
        </h2>
        <p className="text-sm">{translate("No_Channels_Available_Description")}</p>
        <AnchorButton className="w-[150px]" href="/vendor/settings/store">Connect</AnchorButton>
      </div>
    </div>
  );
}
