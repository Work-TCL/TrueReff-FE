import React from "react";
import AuthLayoutPage from "./auth-layout";
import BackButton from "@/lib/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";
import ForgotPasswordForm from "./components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="mt-6 mx-auto max-w-lg w-full">
        <BackButton className="mb-5" />
        <AuthTitle text="Forgot Password" />
        <AuthDescription className="mt-2" text="Enter your registered email address. we’ll send you a code to reset
            your password." />
        <div className="mt-5">
            <ForgotPasswordForm/>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
