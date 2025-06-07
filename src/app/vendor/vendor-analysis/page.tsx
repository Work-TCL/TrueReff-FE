import Loader from "@/app/_components/components-common/layout/loader";
import CreatorAnalysis from "@/app/_components/pages/creator_analysis";
import React, { Suspense } from "react";

export default function CreatorAnalysisPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CreatorAnalysis />
    </Suspense>
  );
}
