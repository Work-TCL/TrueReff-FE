import EmailVerifyOtpPage from "@/app/_components/pages/auth/email-otp";
import React, { Suspense } from "react";

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <EmailVerifyOtpPage />
  </Suspense>
}
