import React, { Suspense } from "react";
import CollaborationList from "@/app/_components/pages/creator/collaboration";
import Loader from "@/app/_components/components-common/layout/loader";

export default function CollaborationPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CollaborationList />
    </Suspense>
  );
}
