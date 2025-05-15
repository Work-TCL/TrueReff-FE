import Loader from "@/app/_components/components-common/layout/loader";
import CampaignList from "@/app/_components/pages/campaigns/list";
import React, { Suspense } from "react";

export default function AddProductPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CampaignList />
    </Suspense>
  );
}
