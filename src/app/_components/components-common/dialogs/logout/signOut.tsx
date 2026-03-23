"use client";
import Button from "@/app/_components/ui/button";
import { useAuthStore } from "@/lib/store/auth-user";
import { clearLocalStorage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { platform } from "os";
import React from "react";

export const handleLogout = async (account: any) => {
  try {
      await axios.post(`/auth/logout`, {
        accountId: account.id,
        platform: "web"
      })
  } catch (err) {

  }
  await signOut({
    callbackUrl: "/login",
    redirect: true,
  });
  clearLocalStorage();
};
export default function SignOut() {
  const t = useTranslations();
  const {account} = useAuthStore();
  return (
    <Button
      onClick={() => handleLogout(account)}
      size="medium"
      className="px-6 text-sm"
      type="submit"
    >
      {t("Submit")}
    </Button>
  );
}
