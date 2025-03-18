import PackageDetails from "@/app/_components/pages/settings/package-details";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import React, { Suspense } from "react";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <StoreConnects />
  </Suspense>
}
