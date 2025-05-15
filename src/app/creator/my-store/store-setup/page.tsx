import Loader from "@/app/_components/components-common/layout/loader";
import StoreDetailView from "@/app/_components/pages/my-store/store-detail-view";
import StoreSetUp from "@/app/_components/pages/my-store/store-set-up";
import React, { Suspense } from "react";

export default function StoreSetUpPage() {
  return (
    <Suspense fallback={<Loader />}>
      <StoreSetUp />
    </Suspense>
  );
}
