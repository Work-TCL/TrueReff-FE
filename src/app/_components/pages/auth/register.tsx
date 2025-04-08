import Link from "next/link";
import React from "react";
import HeaderAuth from "./components/header-auth";
import AuthLayoutPage from "./auth-layout";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import LightButton from "@/app/_components/ui/button/variant/light-button";
import SocialAuth from "./components/social-auth";
import { translate } from "@/lib/utils/translate";

export default function RegisterPage() {
  return (
    <AuthLayoutPage authImage="sign-up-image.svg">
      <div className="flex flex-col justify-center h-full w-full mx-auto max-w-lg min-h-fit">
        <HeaderAuth />
        <div className="w-full md:pt-6 pt-4 ">
          <div className="flex justify-center md:text-[32px] text-2xl font-semibold text-gray-darken text-center">
            {translate("Sign_up_to_get_started")}
          </div>
          <div className="mt-5">
            <RegisterForm />
          </div>
          <div className="my-6 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              {translate("Or_Continue_with")}
            </div>
          </div>
          <SocialAuth />
          <div className="my-6 text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              {translate("Log_inAlready_have_an_account?")}{" "}
              <Link href="/login" className="text-primary-color font-medium">
                {translate("Log_in")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
