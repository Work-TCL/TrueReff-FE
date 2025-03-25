import Loader from "@/app/_components/components-common/layout/loader";
import ForgotPasswordPage from "@/app/_components/pages/auth/forgot-password";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
