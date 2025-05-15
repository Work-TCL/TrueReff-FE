import React, { Suspense } from "react";
import CreateCampaign from "@/app/_components/pages/campaigns/create";
import Loader from "@/app/_components/components-common/layout/loader";

export default async function DetailsPage(props: any) {
  const isDetailsView = await props?.searchParams;
  return (
    <Suspense fallback={<Loader />}>
      <CreateCampaign isDetailView={isDetailsView?.view === "true"} />
    </Suspense>
  );
}
