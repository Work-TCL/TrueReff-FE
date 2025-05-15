"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { Button as CButton } from "@/components/ui/button";
import Button from "@/app/_components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description: string;
  warning?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  warning,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <DialogLayout
      open={open}
      size="!max-w-[438px] w-full overflow-auto m-2"
      title={title || ""}
      skipClose={true}
    >
      <div className="p-2 sm:p-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full flex flex-col gap-4 overflow-y-auto">
        <p className="text-xs md:text-sm text-gray-500">{description}</p>
        {warning && (
          <p className="text-xs md:text-sm text-red-500">{warning}</p>
        )}

        <div className="grid grid-cols-2 gap-x-4 mt-4">
          <CButton
            variant="outline"
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-full h-full border-black bg-transparent text-base"
          >
            Cancel
          </CButton>
          <Button
            loading={loading}
            disabled={loading}
            className="w-full h-full border-black text-white"
            onClick={onConfirm}
          >
            Ok
          </Button>
        </div>
      </div>
    </DialogLayout>
  );
}
