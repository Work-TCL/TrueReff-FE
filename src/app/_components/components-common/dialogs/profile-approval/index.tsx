"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import Button from "@/app/_components/ui/button";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { clearLocalStorage } from "@/lib/utils/commonUtils";
import { Timer } from "lucide-react";

export default function ProfileAccess() {
  const t = useTranslations();
const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
    clearLocalStorage();
  };
  return (
    <DialogLayout
      open={true}
      size="!max-w-[638px] w-full overflow-auto"
      skipClose={true}

    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto">
        <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
          <Timer />
        </span>

        <h3 className="mb-2 text-2xl font-bold text-gray-800">
          {t("Profile_Submitted_for_Approval")}
        </h3>
        <p className="text-gray-500">{t("Your_profile_is_sent_for_admin_approval")}</p>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLogout}
            size="medium"
            className="px-6 text-sm w-40"
            type="submit"
          >
            {t("Back_to_login")}
          </Button>
        </div>
      </div>
    </DialogLayout>
  );
}
