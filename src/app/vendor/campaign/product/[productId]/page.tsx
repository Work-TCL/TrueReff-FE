import React, { Suspense } from "react";
import CreateCampaign from "@/app/_components/pages/campaigns/create";
import Loader from "@/app/_components/components-common/layout/loader";
import CreateProductCampaign from "@/app/_components/pages/campaigns/createProductCampaign";

export default async function DetailsPage(props: any) {
  const isDetailsView = await props?.searchParams;
  const params = await props?.params;
  console.log("---------------", params?.productId);

  return (
    <Suspense fallback={<Loader />}>
      <CreateProductCampaign isDetailView={isDetailsView?.view === "true"} />
    </Suspense>
  );
}
