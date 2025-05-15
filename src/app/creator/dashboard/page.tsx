import React, { Suspense } from "react";
import Loader from "@/app/_components/components-common/layout/loader";
import Dashboard from "@/app/_components/pages/dashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Dashboard />
    </Suspense>
  );
}
