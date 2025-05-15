import Loader from "@/app/_components/components-common/layout/loader";
import LoginPage from "@/app/_components/pages/auth/login";
import React, { Suspense } from "react";

export default function Login() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginPage />
    </Suspense>
  );
}
