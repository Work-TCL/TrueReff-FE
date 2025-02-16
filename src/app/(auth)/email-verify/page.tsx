import EmailVerifyOtpPage from "@/app/_components/auth/email-otp";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return <EmailVerifyOtpPage searchParams={searchParams} />;
}
