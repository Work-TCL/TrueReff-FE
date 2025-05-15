import React, { Suspense } from "react";
import SendOtpPage from "@/app/_components/pages/auth/send-otp";
import Loader from "@/app/_components/components-common/layout/loader";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <SendOtpPage />
    </Suspense>
  );
}
