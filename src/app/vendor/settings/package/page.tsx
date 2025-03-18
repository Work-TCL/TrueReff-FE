import PackageDetails from "@/app/_components/pages/settings/package-details";
import React, { Suspense } from "react";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <PackageDetails />
  </Suspense>
}
