"use client";
import React, { useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import AddBalanceForm from "./add-balance-form";
import { useTranslations } from "next-intl";

export default function AddBalance({
  open = false,
  onClose,
  handleRefresh = () =>{}
}: any) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const translate = useTranslations();
  return (
    <DialogLayout
      open={Boolean(open)}
      size="!max-w-[682px] w-full overflow-auto m-2"
      title={translate("Add_Balance_into_your_Wallet")}
      onClose={() => !submitting && onClose()}
    >
      <div className="pt-0 px-2 pb-2 sm:px-4 sm:pb-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full overflow-y-auto relative">
        <AddBalanceForm
          onClose={onClose}
          submitting={submitting}
          setSubmitting={setSubmitting}
          handleRefresh={handleRefresh}
        />
      </div>
    </DialogLayout>
  );
}
