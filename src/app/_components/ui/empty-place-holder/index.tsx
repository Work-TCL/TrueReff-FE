"use client";
import React from 'react';
import { translate } from "@/lib/utils/translate";
import { Info } from "lucide-react";
interface IEmptyPlaceHolderProps {
    title: string;
    description?: string;
}
export function EmptyPlaceHolder({title = "No Data Found",description = ""}:IEmptyPlaceHolderProps) {
    return (
        <div className="flex items-center justify-center flex-col min-h-[calc(100vh-90px)] col-span-full text-center text-gray-500 p-4 bg-white rounded-xl">
            <Info height={50} width={50} className="mx-auto mb-2 text-gray-400" />
            <h2 className="text-lg font-semibold">
                {translate(title)}
            </h2>
            <p className="text-sm">
                {translate(description)}
            </p>
        </div>
    );
}