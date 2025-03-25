import Loader from "@/app/_components/components-common/layout/loader";
import ViewCreatorDetail from "@/app/_components/pages/creator/ViewCreatorDetail";
import React, { Suspense } from "react";

export default function ViewCreatorDetailPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ViewCreatorDetail />
    </Suspense>
  );
}
