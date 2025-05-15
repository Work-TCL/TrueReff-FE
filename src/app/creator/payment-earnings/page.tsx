import Loader from "@/app/_components/components-common/layout/loader";
import PaymentEarnings from "@/app/_components/pages/payment-earnings";
import React, { Suspense } from "react";

export default function PaymentEarningsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PaymentEarnings />
    </Suspense>
  );
}
