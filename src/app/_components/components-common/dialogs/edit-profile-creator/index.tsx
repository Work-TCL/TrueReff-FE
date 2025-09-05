"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditCreatorForm from "./creator-edit";
import { useTranslations } from "next-intl";

export default function EditProfileCreator({ open = false, onClose }: any) {
  const translate = useTranslations();
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full p-2 md:p-4 m-2"
      title={translate("Edit_Profile")}
      onClose={onClose}
      titleClassName="m-0 !p-0 mb-3"
    >
      <div className="p-2 md:p-4 sm:p-10 pb-0 sm:pb-0 sm:rounded-md w-full">
        <EditCreatorForm onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
