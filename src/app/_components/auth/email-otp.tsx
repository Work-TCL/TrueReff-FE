import React from "react";
import AuthLayoutPage from "./auth-layout";
import BackButton from "@/lib/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";
import EmailVerifyOTPForm from "./components/email-verify";
import { translate } from "@/lib/utils/translate";

export default function EmailVerifyOtpPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const email = searchParams?.email || "";
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="flex flex-col justify-center mx-auto max-w-lg w-full h-full">
        <div className="w-full">
          <BackButton className="mb-5" />
          <AuthTitle text={translate("Enter OTP")} />
          <AuthDescription
            className="mt-2"
            text={`${translate(
              "We have share a code of your registered email address"
            )}
             ${email}`}
          />
          <div className="mt-5">
            <EmailVerifyOTPForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
