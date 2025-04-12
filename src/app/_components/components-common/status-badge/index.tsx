"use client";
import { badgeColor, statusMessage } from "@/lib/utils/constants";
import React from "react";


export default function StatusBadge({ status,messageStatus }: { status: string,messageStatus?: string }) {
    return <div className={`${badgeColor[status]} min-w-[180px] text-center bg-opacity-10 text-sm font-medium px-3 py-2 rounded-md dark:bg-blue-900 dark:text-blue-300`}>
        {statusMessage[messageStatus??status]}
    </div>
}