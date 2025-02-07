"use client";

import React from "react";
import SalesChart from "../charts/SalesChart";
import DonutChart from "../charts/DonutChat";
import MostSellingBrands from "../charts/MostSellingBrands";
import RecentActivities from "../tables/RecentActivity";
import VendorActivity from "../charts/VendorActivityChart";
import StatesCards from "../states/StatesCard";

export default function Overview() {
    return (
        <div className="flex flex-col gap-4 p-6 w-full">
            <StatesCards />
            <div className="flex flex-col xl:flex-row gap-5 w-full">
                <div className="flex flex-col xl:w-3/4 gap-5">
                    <div className="flex flex-col md:flex-row gap-4">
                        <SalesChart />
                        <DonutChart />
                    </div>
                    <div>
                        <RecentActivities />
                    </div>
                </div>
                <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/4 gap-4">
                    <MostSellingBrands />
                    <VendorActivity />
                </div>
            </div>
        </div>
    )
}