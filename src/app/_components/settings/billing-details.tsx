"use client";
import Button from "@/lib/ui/button";
import React, { useState } from "react";

export default function BillingDetails() {

    return (
        <div className="flex flex-col w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
                <h2 className="text-sm xl:text-lg font-semibold">Billing Details</h2>
                <button className="text-sm text-primary">Edit details</button>
            </div>
            <div className="flex flex-col gap-1 xl:gap-4">
                <div className="flex gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <span>Billing Name:</span>
                    <span className="text-black">Robert Fox Enterprises</span>
                </div>
                <div className="flex  gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <span>GST Number:</span>
                    <span className="text-black">22AAAAA0000A1Z5</span>
                </div>
                <div className="flex gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <span>Billing Address:</span>
                    <span className="text-black">123 Business Street, New York, USA</span>
                </div>
                {/* <div className="flex flex-col text-[14px] xl:text-[16px] gap-2">
                    <span className="font-medium">Robert Fox Enterprises</span>
                    <span className="font-medium">22AAAAA0000A1Z5</span>
                    <span className="font-medium">123 Business Street, New York, USA</span>
                </div> */}
            </div>
        </div>
    )
}