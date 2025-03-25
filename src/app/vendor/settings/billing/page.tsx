import Loader from "@/app/_components/components-common/layout/loader";
import BillingDetails from "@/app/_components/pages/settings/billing-details";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <BillingDetails />
    </Suspense>
  );
}
