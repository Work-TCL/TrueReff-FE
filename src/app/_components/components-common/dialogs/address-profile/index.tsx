"use client";
import React, { useEffect, useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditAddressVendorForm from "./vendor-edit";
import { translate } from "@/lib/utils/translate";

const key = "address";

export default function EditAddressProfile({
  address,
  id,
  editKey = "",
  onClose = () => {},
}: any) {
  const dialogPath = editKey === key;
  return (
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[600px] w-full overflow-auto"
      title={address ? translate("edit_address") : translate("add_new_address")}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditAddressVendorForm profile={address} id={id} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
