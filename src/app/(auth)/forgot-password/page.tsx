import ForgotPasswordPage from "@/app/_components/pages/auth/forgot-password";
import React, { Suspense } from "react";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ForgotPasswordPage />
  </Suspense>
}
