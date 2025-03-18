import React from "react";
import AuthLayoutPage from "./auth-layout";
import AuthDescription from "./components/auth-desc";
import AuthTitle from "./components/auth-title";
import BackButton from "@/app/_components/ui/back-button";
import ResetPasswordForm from "./components/reset-password-form";
import { translate } from "@/lib/utils/translate";

export default function ResetPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="flex flex-col justify-center mx-auto max-w-lg w-full h-full">
        <div className="w-full">
          <BackButton className="mb-5" />
          <AuthTitle text={translate("Reset_Password")} />
          <AuthDescription
            className="mt-2"
            text={`${translate("Enter_new_password_to_secure_your_account")}`}
          />
          <div className="mt-5">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
