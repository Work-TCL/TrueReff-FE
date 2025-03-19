import React from "react";
import AuthLayoutPage from "./auth-layout";
import HeaderAuth from "./components/header-auth";
import Link from "next/link";
import LoginForm from "./components/login-form";
import SocialAuth from "./components/social-auth";
import { translate } from "@/lib/utils/translate";

export default function LoginPage() {
  return (
    <AuthLayoutPage>
      <div className="flex flex-col justify-center h-full w-full mx-auto max-w-lg">
        <HeaderAuth />
        <div className="w-full pt-6">
          <div className="flex justify-center text-[32px] font-semibold text-gray-darken">
            {translate('Welcome_Back!')}
          </div>
          <div className="mt-5">
            <LoginForm />
          </div>
          <div className="my-6 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              {translate("Or_Continue_with")}
            </div>
          </div>
          <SocialAuth />
          <div className="my-6 text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              {translate("Dont_have_an_account?")}{" "}
              <Link href="/register" className="text-primary-color font-medium">
                {translate("Sign_up_here")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
