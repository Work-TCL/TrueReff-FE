"use client";
import { badgeColor, statusMessage } from "@/lib/utils/constants";
import React from "react";


export default function StatusBadge({ status,messageStatus }: { status: string,messageStatus?: string }) {
    return <div
    className={`${badgeColor[status]} bg-opacity-10 p-2 rounded-md text-center`}
  >
    {statusMessage[messageStatus??status]}
  </div>
}