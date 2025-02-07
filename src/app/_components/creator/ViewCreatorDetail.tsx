"use client";

import React from "react";
import StatesCards from "../states/StatesCard";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function ViewCreatorDetail() {
    return (
        <div className="flex flex-col gap-4 p-6 w-full">
            <div className="text-[20px] text-500">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/product/list">Creator Lists</BreadcrumbLink>
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
                    <div className="border bg-white rounded-2xl h-[400px] p-6">
                        Monica Bing
                    </div>
                    <div className="border bg-white rounded-2xl h-[400px] p-6">
                        <h2 className="font-semibold">Total Collaboration through platform</h2>
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full xl:w-1/2">
                    <div className="border bg-white rounded-2xl h-[360px] p-6">
                        <h2 className="font-semibold">Total Sales By Our Channel</h2>
                    </div>
                    <div className="flex flex-col xl:flex-row md:flex-row  gap-5 w-full">
                        <div className="border bg-white rounded-2xl h-[400px] w-full xl:w-1/2 p-6">
                            <h2 className="font-medium">Sales Breakdown by Category</h2>
                        </div>
                        <div className="border bg-white rounded-2xl h-[400px] w-full xl:w-1/2 p-6">
                            <h2 className="font-medium">Total Views</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}