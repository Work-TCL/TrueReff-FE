"use client";
import { translate } from "@/lib/utils/translate";
import React from "react";
import AnchorButton from "../../ui/button/variant";
import { Info } from "lucide-react";

export default function StoreConnectsRedirect() {
  return (
    <div
      className={`flex flex-col w-full max-w-xl bg-white rounded-xl p-4 xl:p-8 gap-2 shadow-md m-auto`}
    >
      <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white ">
            <Info className="mx-auto mb-2 text-gray-400" />
            <h2 className="text-lg font-semibold">
                {translate("No_Channels_Available_Title")}
            </h2>
            <p className="text-sm">{translate("No_Channels_Available_Description")}</p>
        </div>
      {/* <div className="flex justify-center items-center pb-8">
        <h2 className="text-sm xl:text-3xl text-center font-semibold">
          {translate("store_integration")}
        </h2>
      </div> */}
      <AnchorButton href="/vendor/settings/store">Connect</AnchorButton>
    </div>
  );
}
