import React, { Suspense } from "react";
import RegisterPage from "@/app/_components/pages/auth/register";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <RegisterPage />
  </Suspense>
}
