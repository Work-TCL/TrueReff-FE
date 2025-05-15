"use client";
import { badgeColor, statusMessage } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import React from "react";

export default function StatusBadge({
  status,
  messageStatus,
}: {
  status: string;
  messageStatus?: string;
}) {
  const t = useTranslations("statusMessage");
  return (
    <div
      className={`${badgeColor[status]} text-sm bg-opacity-10 font-medium me-2 px-2.5 py-0.5 rounded-sm text-center`}
    >
      {t(messageStatus ?? status)}
    </div>
  );
}
