"use client";

import React from "react";
import StatesCards from "../../components-common/states/StatesCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {translate} from "../../../../lib/utils/translate";
import CreatorProfile from "./creator-profile";

export default function ViewCreatorDetail() {
    return (
        <div className="flex flex-col gap-4 p-6 w-full">
            <div className="text-[20px] text-500">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product/list">{translate("Creator_Lists")}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Monica Bing</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <StatesCards />
            <div className="flex flex-col xl:flex-row gap-5 w-full">
                <div className="flex flex-col gap-5 w-full xl:w-1/2">
                    <CreatorProfile />
                    <div className="border bg-white rounded-2xl h-[400px] p-6">
                        <h2 className="font-semibold">{translate("Total_Collaboration_through_platform")}</h2>
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full xl:w-1/2">
                    <div className="border bg-white rounded-2xl h-[360px] p-6">
                        <h2 className="font-semibold">{translate("Total_Sales_By_Our_Channel")}</h2>
                    </div>
                    <div className="flex flex-col xl:flex-row md:flex-row  gap-5 w-full">
                        <div className="border bg-white rounded-2xl h-[400px] w-full xl:w-1/2 p-6">
                            <h2 className="font-medium">{translate("Sales_Breakdown_by_Category")}</h2>
                        </div>
                        <div className="border bg-white rounded-2xl h-[400px] w-full xl:w-1/2 p-6">
                            <h2 className="font-medium">{translate("Total_Views")}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}