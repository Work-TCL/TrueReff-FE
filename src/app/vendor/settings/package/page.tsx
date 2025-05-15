import Loader from "@/app/_components/components-common/layout/loader";
import PackageDetails from "@/app/_components/pages/settings/package-details";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <PackageDetails />
    </Suspense>
  );
}
