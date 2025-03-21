"use client";
import { translate } from "@/lib/utils/translate";
import React from "react";
import AnchorButton from "../../ui/button/variant";

export default function StoreConnectsRedirect() {
  return (
    <div
      className={`flex flex-col w-full max-w-xl bg-white rounded-xl p-4 xl:p-8 gap-2 shadow-md m-auto`}
    >
      <div className="flex justify-center items-center pb-8">
        <h2 className="text-sm xl:text-3xl text-center font-semibold">
          {translate("store_integration")}
        </h2>
      </div>
      <AnchorButton href="/vendor/settings/store">Connect</AnchorButton>
    </div>
  );
}
