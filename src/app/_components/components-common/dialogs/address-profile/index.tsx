"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditAddressVendorForm from "./vendor-edit";
import { translate } from "@/lib/utils/translate";

export default function EditAddressProfile({
  address,
  id,
  onClose = () => {},
  open = false,
}: any) {
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[600px] w-full overflow-auto p-4"
      title={address ? translate("edit_address") : translate("add_new_address")}
      onClose={onClose}
    >
      <div className="px-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditAddressVendorForm profile={address} id={id} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
