import React from "react";
import AuthLayoutPage from "./auth-layout";
import BackButton from "@/app/_components/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";
import ForgotPasswordForm from "./components/forgot-password-form";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const translate = useTranslations();
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="flex flex-col justify-center mx-auto max-w-lg w-full h-full min-h-fit">
        <div className="w-full">
          <BackButton className="mb-5" />
          <AuthTitle text={translate("Forgot_Password")} />
          <AuthDescription
            className="mt-2"
            text={translate(
              "Enter_your_registered_email_address_well_send_you_a_code_to_reset_your_password"
            )}
          />
          <div className="mt-5">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
