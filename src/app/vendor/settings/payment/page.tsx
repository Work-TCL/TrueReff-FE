import Loader from "@/app/_components/components-common/layout/loader";
import PaymentOptions from "@/app/_components/pages/settings/payment-options";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentOptions />
    </Suspense>
  );
}
