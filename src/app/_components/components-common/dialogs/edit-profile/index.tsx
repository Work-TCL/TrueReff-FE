"use client";
import React, { useEffect, useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditVendorForm from "./vendor-edit";
import { translate } from "@/lib/utils/translate";

const key = "profile";

export default function EditProfile({ profile, editKey = "" }: any) {
  const dialogPath = editKey === key;
  return (
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[682px] w-full overflow-auto"
      title={translate("Edit_Profile")}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditVendorForm profile={profile} />
      </div>
    </DialogLayout>
  );
}
