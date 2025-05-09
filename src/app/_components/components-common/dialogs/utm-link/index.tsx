"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import UTMForm from "./utm-form";
import { useTranslations } from "next-intl";

export default function UtmLinkForm({ open = false, onClose }: any) {
  const translate = useTranslations();
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto"
      title={translate("Generate_UTM")}
      onClose={onClose}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full overflow-y-auto relative">
        <UTMForm onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
