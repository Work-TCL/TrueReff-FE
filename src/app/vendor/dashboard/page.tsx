import Overview from "@/app/_components/pages/overview";
import React, { Suspense } from "react";

export default function OverviewPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Overview />
  </Suspense>
}
