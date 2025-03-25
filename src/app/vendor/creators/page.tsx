import Loader from "@/app/_components/components-common/layout/loader";
import CreatorList from "@/app/_components/pages/creator/list";
import React, { Suspense } from "react";

export default function CreatorPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CreatorList />
    </Suspense>
  );
}
