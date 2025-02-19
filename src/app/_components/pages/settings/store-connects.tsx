"use client";
import { Input } from "@/components/ui/input";
import Button from "@/app/_components/ui/button";
import React, { useState } from "react";
import {translate} from "../../../../lib/utils/translate";

export default function StoreConnects() {

    return (
        <div className="flex flex-col w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-2 shadow-md">
            <div className="flex justify-between items-center pb-4">
                <h2 className="text-sm xl:text-lg font-semibold">{translate("Store Integration")}</h2>
            </div>
            <div className="flex flex-col gap-1 xl:gap-4">
                <div className="flex flex-col gap-2 text-[14px] xl:text-[16px] text-gray-500">
                    <label>{translate("Store ID")}</label>
                    <Input name="storeId" placeholder={translate("Enter Shopify or wordpress Store ID")} className="rounded-xl h-[46px] text-[12px] xl:text-[16px] xl:h-[56px] bg-white"/>
                </div>
                <div className="flex  gap-2 text-[14px] xl:text-[16px] mt-4 xl:mt-6 text-gray-500">
                    <Button className="w-[215px]">{translate("Connect Now")}</Button>
                </div>
            </div>
        </div>
    )
}