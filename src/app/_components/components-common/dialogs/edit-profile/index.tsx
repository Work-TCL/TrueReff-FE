"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditVendorForm from "./vendor-edit";
import { useTranslations } from "next-intl";

export default function EditProfile({ profile, open = false, onClose }: any) {
  const translate = useTranslations();
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto p-4"
      title={translate("Edit_Profile")}
      onClose={onClose}
      titleClassName="m-0 !p-0 mb-3"
    >
      <div className="px-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditVendorForm profile={profile} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
