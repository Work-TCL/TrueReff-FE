import Loader from "@/app/_components/components-common/layout/loader";
import React, { Suspense } from "react";
import AccountRecharge from "./_components/main";

export default function PaymentEarningsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AccountRecharge />
    </Suspense>
  );
}
