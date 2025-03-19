import PaymentOptions from "@/app/_components/pages/settings/payment-options";
import React, { Suspense } from "react";

export default function page() {
  return  <Suspense fallback={<div>Loading...</div>}>
    <PaymentOptions />
  </Suspense>
}
