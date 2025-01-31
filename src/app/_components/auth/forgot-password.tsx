import React from "react";
import AuthLayoutPage from "./auth-layout";
import Button from "@/lib/ui/button";
import BackButton from "@/lib/ui/back-button";
import AuthTitle from "./components/auth-title";
import AuthDescription from "./components/auth-desc";

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="mt-6 mx-auto max-w-lg w-full">
        <BackButton className="mb-5" />
        <AuthTitle text="Forgot Password" />
        <AuthDescription className="mt-2" text="Enter your registered email address. we’ll send you a code to reset
            your password." />
        <div className="mt-5">
            <input
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="email"
              placeholder="Email"
            />
          <Button className="mt-5">Send OTP</Button>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
