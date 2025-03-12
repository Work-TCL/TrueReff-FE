"use client"; // This ensures it's a Client Component

import React from "react";
import { useSearchParams } from "next/navigation";
import AuthLayoutPage from "./auth-layout";
import BackButton from "@/app/_components/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";
import EmailVerifyOTPForm from "./components/email-verify";
import { translate } from "@/lib/utils/translate";
import authOptions from "@/lib/config/authOptions";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export default function EmailVerifyOtpPage() {
  const searchParams = useSearchParams(); // ✅ Correct way to access search params in a Client Component
  const { data: session, status } = useSession();
console.log("session----->", status,session)
  // Ensure safe access to search parameters
  const email = searchParams.get("email") || "";

  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="flex flex-col justify-center mx-auto max-w-lg w-full h-full">
        <div className="w-full">
          <BackButton className="mb-5" />
          <AuthTitle text={translate("Enter_OTP")} />
          <AuthDescription
            className="mt-2"
            text={`${translate(
              "We_have_share_a_code_of_your_registered_email_address"
            )} ${email}`}
          />
          <div className="mt-5">
            <EmailVerifyOTPForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
