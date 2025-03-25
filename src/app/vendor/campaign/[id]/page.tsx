import React, { Suspense } from "react";
import CreateCampaign from "@/app/_components/pages/campaigns/create";
import Loader from "@/app/_components/components-common/layout/loader";

export default function DetailsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <CreateCampaign />
    </Suspense>
  );
}
