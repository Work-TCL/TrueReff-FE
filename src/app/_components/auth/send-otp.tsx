import React from "react";
import AuthLayoutPage from "./auth-layout";
import Button from "@/lib/ui/button";
import BackButton from "@/lib/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";
import VerifyOTPForm from "./components/otp-form";

export default function SendOtpPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="flex flex-col justify-center mx-auto max-w-lg w-full h-full">
        <div className="w-full">
          <BackButton className="mb-5" />
          <AuthTitle text="Enter OTP" />
          <AuthDescription
            className="mt-2"
            text="We have share a code of your registered email address
            robertfox@example.com"
          />
          <div className="mt-5">
            <VerifyOTPForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
