"use client";
import Button from "@/app/_components/ui/button";
import React, { useState } from "react";
import {translate} from "../../../../lib/utils/translate";

export default function BillingDetails() {

    return (
        <div className="flex flex-col w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
                <h2 className="text-sm xl:text-lg font-semibold">{translate("Billing Details")}</h2>
                <button className="text-sm text-primary">{translate("Edit details")}</button>
            </div>
            <div className="flex flex-col gap-1 xl:gap-4">
                <div className="flex gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <span>{translate("Billing Name")}:</span>
                    <span className="text-black">Robert Fox Enterprises</span>
                </div>
                <div className="flex  gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <span>{translate("GST Number")}:</span>
                    <span className="text-black">22AAAAA0000A1Z5</span>
                </div>
                <div className="flex gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <span>{translate("Billing Address")}:</span>
                    <span className="text-black">123 Business Street, New York, USA</span>
                </div>
            </div>
        </div>
    )
}