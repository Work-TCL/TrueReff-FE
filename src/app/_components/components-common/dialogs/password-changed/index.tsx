"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { useSearchParams } from "next/navigation";
import AnchorButton from "@/app/_components/ui/button/variant";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CHANGE_PASS_SUCCESS = "change-password-success";

export default function PasswordSuccess() {
  const t = useTranslations();
  const auth = useSearchParams().get("auth");
  const dialogPath = auth === CHANGE_PASS_SUCCESS;

  return (
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[638px] w-full overflow-auto"
      skipClose={true}
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto">
        <span className="mb-4 inline-flex justify-center items-center rounded-full">
          <Image
            src="/assets/auth/change-pass-succes.png"
            alt="sucess"
            width={200}
            height={200}
          />
        </span>

        <h3 className="mb-2 text-2xl text-gray-800">{t("password_changes")}</h3>
        <p className="text-gray-500 text-sm">{t("password_changes_success")}</p>

        <div className="mt-6">
          {/* <AnchorButton
            href="?"
            size="medium"
            className="bg-transparent border-gray-300 text-center"
          >
            Cancel
          </AnchorButton> */}
          <AnchorButton href="/login" className="text-sm">
            {t("BacktoLogin")}
          </AnchorButton>
        </div>
      </div>
    </DialogLayout>
  );
}
