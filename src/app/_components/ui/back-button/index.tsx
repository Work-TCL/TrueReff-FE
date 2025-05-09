"use client";
import { cn } from "@sohanemon/utils";
import React from "react";
import { useRouter } from "next/navigation";
import { GoChevronLeft } from "react-icons/go";
import { useTranslations } from "next-intl";

interface IBackButton {
  className?: string;
}

export default function BackButton({ className = "" }: IBackButton) {
  const translate = useTranslations();
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div
      className={cn(
        "text-sm text-gray-darken cursor-pointer flex items-center gap-2",
        className
      )}
      onClick={handleGoBack}
    >
      <GoChevronLeft className="text-xl" /> {translate("Back")}
    </div>
  );
}
