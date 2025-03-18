import BillingDetails from "@/app/_components/pages/settings/billing-details";
import React, { Suspense } from "react";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <BillingDetails />
  </Suspense>
}
