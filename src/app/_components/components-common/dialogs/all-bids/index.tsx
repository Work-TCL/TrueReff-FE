"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CircleX } from "lucide-react";

export default function ViewAllBids({
    onClose = () => { },
    bids = [],
}) {
    const translate = useTranslations();
    return (
        <DialogLayout
            open={true}
            size="overflow-auto"
            title=""
            skipClose={true}
        // onClose={() => !loading && onClose()}
        >
            <div className=" shadow-xl p-2 md:p-6 text-center border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Bid History</h2>
                    <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                    >
                        <CircleX/>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="text-left text-sm text-gray-700 space-y-2 max-h-48 overflow-y-auto pr-2">
                    {bids.map((item:any, index) => (
                        <div key={index} className="flex items-start gap-2">
                        <div className="w-[120px] text-sm text-gray-500 text-nowrap">
                          {item?.sender === 'vendor'? "Brand Offered":"Creator Offered"}:
                        </div>
                        <div className="font-medium text-sm break-words">
                          {item?.proposal}{" "}{item?.type === "FIXED_AMOUNT" ? "₹" : "%"}
                        </div>
                      </div>
                    ))}
                    {/* Add more bid history items here if needed */}
                </div>
            </div>
        </DialogLayout>
    );
}
