import React from "react";
import AuthLayoutPage from "./auth-layout";
import HeaderAuth from "./components/header-auth";
import Link from "next/link";
import LoginForm from "./components/login-form";
import LightButton from "@/lib/ui/button/variant/light-button";
import SocialAuth from "./components/social-auth";

export default function LoginPage() {
  return (
    <AuthLayoutPage>
      <HeaderAuth />
      <div className="mt-6 flex flex-col items-center mx-auto max-w-lg">
        <div className="w-full flex-1">
          <div className="flex justify-center text-[32px] font-bold">
            Welcome Back!
          </div>
          <div className="mt-5">
            <LoginForm />
          </div>
          <div className="my-6 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Or Continue with
            </div>
          </div>
          <SocialAuth />
          <div className="my-6 text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Don’t have an account?{" "}
              <Link href="/register" className="text-primary-color font-medium">
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
