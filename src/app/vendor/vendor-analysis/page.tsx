import Loader from "@/app/_components/components-common/layout/loader";
import CombineAnalytics from "@/app/_components/pages/creator_analysis";
import React, { Suspense } from "react";

export default function VendorAnalysisPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CombineAnalytics mode="vendor" />
    </Suspense>
  );
}
