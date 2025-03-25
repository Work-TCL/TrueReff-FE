import React, { Suspense } from "react";
import ResetPasswordPage from "@/app/_components/pages/auth/reset-password";
import Loader from "@/app/_components/components-common/layout/loader";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
