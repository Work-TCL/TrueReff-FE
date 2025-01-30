import Link from "next/link";
import React from "react";
import HeaderAuth from "./components/header-auth";
import AuthLayoutPage from "./auth-layout";
import RegisterForm from "./components/register-form";
import SocialAuth from "./components/social-auth";
import AnchorButton from "@/lib/ui/button/variant";
import Button from "@/lib/ui/button";

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutPage authImage="forgot-pass-image.svg">
      <div className="mt-40 flex flex-col justify-center items-center">
        <HeaderAuth />
        <div className="w-full flex-1 ">
          <div className=" mx-auto max-w-lg flex items-center text-[18px] cursor-pointer">
            {"<"} Back!
          </div>
          <div className="mx-auto max-w-lg flex text-[32px] font-bold">
            Forgot Password
          </div>
          <div className="mt-6 mx-auto max-w-lg text-[16px] flex align-middle justify-between  text-gray-600">
            Enter your registered email address. we’ll send you a code to reset
            your password.
          </div>
          <div className="mx-auto max-w-lg mt-5">
            <input
              className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
              type="email"
              placeholder="Email"
            />
            <Button className="mt-5">Send OTP</Button>
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
