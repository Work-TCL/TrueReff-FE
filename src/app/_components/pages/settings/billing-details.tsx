"use client";
import { useTranslations } from "next-intl";
import React from "react";

export default function BillingDetails() {
  const translate = useTranslations();
  return (
    <div className="flex flex-col w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <h2 className="text-sm xl:text-lg font-semibold">
          {translate("billing_details")}
        </h2>
        <button className="text-sm text-primary">
          {translate("edit_details")}
        </button>
      </div>
      <div className="flex flex-col gap-1 xl:gap-4">
        <div className="flex gap-2 text-[14px] xl:text-[16px] text-gray-500">
          <span>{translate("billing_name")}:</span>
          <span className="text-black">Robert Fox Enterprises</span>
        </div>
        <div className="flex  gap-2 text-[14px] xl:text-[16px] text-gray-500">
          <span>{translate("gst_number")}:</span>
          <span className="text-black">22AAAAA0000A1Z5</span>
        </div>
        <div className="flex gap-2 text-[14px] xl:text-[16px] text-gray-500">
          <span>{translate("billing_address")}:</span>
          <span className="text-black">123 Business Street, New York, USA</span>
        </div>
      </div>
    </div>
  );
}
