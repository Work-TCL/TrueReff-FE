"use client";
import React, { useEffect, useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { translate } from "@/lib/utils/translate";
import EditCreatorForm from "./creator-edit";

export default function EditProfileCreator({ open = false, onClose }: any) {
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto p-4"
      title={translate("Edit_Profile")}
      onClose={onClose}
      titleClassName='m-0 !p-0 mb-3'
    >
      <div className="p-4 sm:p-10 pb-0 sm:pb-0 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto relative">
        <EditCreatorForm onClose={onClose} />
      </div>
    </DialogLayout>
  );
}
