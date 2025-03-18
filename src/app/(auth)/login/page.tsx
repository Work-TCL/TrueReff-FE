import LoginPage from "@/app/_components/pages/auth/login";
import React, { Suspense } from "react";

export default function Login() {
  return <Suspense fallback={<div>Loading...</div>}>
    <LoginPage />
  </Suspense>
}
