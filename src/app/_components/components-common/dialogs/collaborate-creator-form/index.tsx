"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";

import { translate } from "@/lib/utils/translate";
import CollaborateRequestForm from "./collaborate-request-form";

export default function CollaborateRequest({ open = false, onClose,creatorId }: any) {
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto"
      title={translate("Collaboration Request Form")}
      onClose={onClose}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full overflow-y-auto relative">
        <CollaborateRequestForm onClose={onClose} creatorId={creatorId}/>
      </div>
    </DialogLayout>
  );
}
