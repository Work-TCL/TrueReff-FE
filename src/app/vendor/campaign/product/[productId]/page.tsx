import React, { Suspense } from "react";
import Loader from "@/app/_components/components-common/layout/loader";
import CreateProductCampaign from "@/app/_components/pages/campaigns/createProductCampaign";

export default async function DetailsPage(props: any) {
  const isDetailsView = await props?.searchParams;
  console.log("isDetailsView",isDetailsView)

  return (
    <Suspense fallback={<Loader />}>
      <CreateProductCampaign isDetailView={isDetailsView?.view === "true"} />
    </Suspense>
  );
}
