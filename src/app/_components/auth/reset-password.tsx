import React from "react";
import AuthLayoutPage from "./auth-layout";
import Button from "@/lib/ui/button";

export default function ResetPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="mt-40 flex flex-col justify-center items-center">
        <div className="w-full flex-1 ">
          <div className=" mx-auto max-w-lg flex items-center text-[18px] cursor-pointer">
            {"<"} Back!
          </div>
          <div className="mx-auto max-w-lg flex text-[32px] font-bold">
            Reset Password
          </div>
          <div className="mt-6 mx-auto max-w-lg text-[16px] flex align-middle justify-between  text-gray-600">
            Enter new password to secure your account.
          </div>
          <div className="mx-auto max-w-lg mt-5">
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
            <Button
              // href="/reset-password"
              className="mt-5 tracking-wide font-semibold bg-[#090919] text-[#FFFFFF] w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
