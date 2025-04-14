"use client";
import React, { useEffect, useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditVendorForm from "./vendor-edit";
import { translate } from "@/lib/utils/translate";

export default function EditProfile({ profile, open = false, onClose }: any) {
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto"
      title={translate("Edit_Profile")}
      onClose={onClose}
    >
      <div className="p-4 sm:p-10 pb-0 sm:pb-0 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditVendorForm profile={profile} onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
