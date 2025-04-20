"use client";
import React, { useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import CollaborateRequestForm from "./collaborate-request-form";

export default function CollaborateRequest({ open = false, onClose,creatorId }: any) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto m-2"
      title={"Send Collaboration Request"}
      onClose={() => !submitting && onClose()}
    >
      <div className="p-2 sm:p-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full overflow-y-auto relative">
        <CollaborateRequestForm onClose={onClose} creatorId={creatorId} submitting={submitting} setSubmitting={setSubmitting}/>
      </div>
    </DialogLayout>
  );
}
