"use client";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface EmptyPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyPlaceholder({
  title = "",
  description = "",
  icon = <Info className="mx-auto mb-2 text-gray-400" />,
}: EmptyPlaceholderProps) {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-center flex-col text-center h-[200px] text-gray-500 p-4 bg-white flex-1 h-full">
      {icon}
      <h2 className="text-lg font-semibold">{title || t("No_Data")}</h2>
      <p className="text-sm">{description || t("No_Data_Desc")}</p>
    </div>
  );
}
