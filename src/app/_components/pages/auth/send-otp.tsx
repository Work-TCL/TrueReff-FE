"use client";
import React from "react";
import AuthLayoutPage from "./auth-layout";
import BackButton from "@/app/_components/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";
import VerifyOTPForm from "./components/otp-form";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SendOtpPage() {
  const translate = useTranslations();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="flex flex-col justify-center mx-auto max-w-lg w-full h-full min-h-fit">
        <div className="w-full">
          <BackButton className="mb-5 w-1/2" />
          <AuthTitle text={translate("Enter_OTP")} />
          <AuthDescription
            className="mt-2"
            text={`${translate(
              "We_have_share_a_code_of_your_registered_email_address"
            )} ${email}`}
          />
          <div className="mt-5 flex md:justify-start justify-center">
            <VerifyOTPForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
