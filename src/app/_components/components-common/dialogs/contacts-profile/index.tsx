"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { translate } from "@/lib/utils/translate";
import EditContactVendorForm from "./vendor-edit";

export default function EditContactProfile({
  contact,
  id,
  open = false,
  onClose = () => {},
}: any) {
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[600px] w-full overflow-auto p-4"
      title={contact ? translate("edit_contact") : translate("add_new_contact")}
      onClose={onClose}
      titleClassName='m-0 !p-0 mb-3'

    >
      <div className="p-4 sm:p-10 pb-0 sm:pb-0 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditContactVendorForm profile={contact} id={id} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
