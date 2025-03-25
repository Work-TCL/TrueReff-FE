import React, { Suspense } from "react";
import RegisterPage from "@/app/_components/pages/auth/register";
import Loader from "@/app/_components/components-common/layout/loader";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <RegisterPage />
    </Suspense>
  );
}
