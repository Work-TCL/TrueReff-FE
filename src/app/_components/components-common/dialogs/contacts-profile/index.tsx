"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditContactVendorForm from "./vendor-edit";
import { useTranslations } from "next-intl";

export default function EditContactProfile({
  contact,
  id,
  open = false,
  onClose = () => {},
}: any) {
  const translate = useTranslations();
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[600px] w-full overflow-auto p-4 m-3"
      title={contact ? translate("edit_contact") : translate("add_new_contact")}
      onClose={onClose}
      titleClassName="m-0 !p-0 mb-3"
    >
      <div className="px-0 md:px-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditContactVendorForm profile={contact} id={id} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
