"use client";
import React, { useEffect, useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditAddressVendorForm from "./vendor-edit";
import { translate } from "@/lib/utils/translate";
import EditContactVendorForm from "./vendor-edit";

const key = "contact";

export default function EditContactProfile({
  contact,
  id,
  editKey = "",
  onClose = () => {},
}: any) {
  const dialogPath = editKey === key;
  return (
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[600px] w-full overflow-auto"
      title={contact ? translate("edit_contact") : translate("add_new_contact")}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditContactVendorForm profile={contact} id={id} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
