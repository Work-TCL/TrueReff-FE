import BargainingView from "@/app/_components/pages/bargaining/view";
import LoadingPage from "@/lib/components/loading-page";
import React, { Suspense } from "react";

export default function Collaboration() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <BargainingView />
    </Suspense>
  );
}
