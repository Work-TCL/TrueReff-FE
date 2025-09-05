"use client";
import React from "react";
import { Info } from "lucide-react";
interface IEmptyPlaceHolderProps {
  title: string;
  description?: string;
}
export function EmptyPlaceHolder({
  title = "No Data Found",
  description = "",
}: IEmptyPlaceHolderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center text-gray-500 p-4 bg-white rounded-xl">
      <Info height={50} width={50} className="mx-auto mb-2 text-gray-400" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xs md:text-sm">{description}</p>
    </div>
  );
}
