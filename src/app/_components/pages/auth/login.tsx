import React from "react";
import AuthLayoutPage from "./auth-layout";
import HeaderAuth from "./components/header-auth";
import Link from "next/link";
import LoginForm from "./components/login-form";
import SocialAuth from "./components/social-auth";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const translate = useTranslations();
  return (
    <AuthLayoutPage>
      <div className="flex flex-col justify-center h-full w-full mx-auto max-w-lg min-h-fit">
        <HeaderAuth redirectUrl={"/"} />
        <div className="w-full md:pt-6 pt-4 ">
          <div className="flex justify-center md:text-[32px] text-2xl font-semibold text-gray-darken">
            {" "}
            {translate("Welcome_Back!")}
          </div>
          <div className="mt-5">
            <LoginForm />
          </div>
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {translate("Or_Continue_with")}
            </span>
            <div className="flex-1 h-px bg-gray-300" />
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
