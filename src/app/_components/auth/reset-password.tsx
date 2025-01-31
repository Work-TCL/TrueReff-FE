import React from "react";
import AuthLayoutPage from "./auth-layout";
import Button from "@/lib/ui/button";
import AuthDescription from "./components/auth-desc";
import AuthTitle from "./components/auth-title";
import BackButton from "@/lib/ui/back-button";

export default function ResetPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="mt-6 mx-auto max-w-lg w-full">
        <BackButton className="mb-5" />
        <AuthTitle text="Reset Password" />
        <AuthDescription className="mt-2" text="Enter new password to secure your account." />
        <div className="mt-5">
            <input
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="password"
              placeholder="Password"
            />
            <input
              className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="confirm-password"
              placeholder="ConfirmPassword"
            />
          <Button className="mt-5">Verify</Button>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
