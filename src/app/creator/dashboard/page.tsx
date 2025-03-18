import Dashboard from "@/app/_components/pages/dashboard";
import React, { Suspense } from "react";

export default function DashboardPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Dashboard />
  </Suspense>
}
