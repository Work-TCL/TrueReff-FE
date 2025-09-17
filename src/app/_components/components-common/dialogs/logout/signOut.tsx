"use client";
import Button from "@/app/_components/ui/button";
import { clearLocalStorage } from "@/lib/utils/commonUtils";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import React from "react";

export const handleLogout = async () => {
  await signOut({
    callbackUrl: "/login",
    redirect: true,
  });
  clearLocalStorage();
};
export default function SignOut() {
  const t = useTranslations();
  return (
    <Button
      onClick={handleLogout}
      size="medium"
      className="px-6 text-sm"
      type="submit"
    >
      {t("Submit")}
    </Button>
  );
}
