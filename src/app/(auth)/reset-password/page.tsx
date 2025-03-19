import React, { Suspense } from "react";
import ResetPasswordPage from "@/app/_components/pages/auth/reset-password";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordPage />
  </Suspense>
}
