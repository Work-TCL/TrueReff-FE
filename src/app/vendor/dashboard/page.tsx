import Loader from "@/app/_components/components-common/layout/loader";
import Overview from "@/app/_components/pages/overview";
import React, { Suspense } from "react";

export default function OverviewPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Overview />
    </Suspense>
  );
}
