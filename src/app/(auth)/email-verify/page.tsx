import Loader from "@/app/_components/components-common/layout/loader";
import EmailVerifyOtpPage from "@/app/_components/pages/auth/email-otp";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <EmailVerifyOtpPage />
    </Suspense>
  );
}
