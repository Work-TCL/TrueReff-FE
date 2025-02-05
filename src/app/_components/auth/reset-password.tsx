import React from "react";
import AuthLayoutPage from "./auth-layout";
import AuthDescription from "./components/auth-desc";
import AuthTitle from "./components/auth-title";
import BackButton from "@/lib/ui/back-button";
import ResetPasswordForm from "./components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="mt-6 flex flex-col justify-center mx-auto max-w-lg w-full h-full">
        <div className="w-full flex-1">
          <BackButton className="mb-5" />
          <AuthTitle text="Reset Password" />
          <AuthDescription
            className="mt-2"
            text="Enter new password to secure your account."
          />
          <div className="mt-5">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
