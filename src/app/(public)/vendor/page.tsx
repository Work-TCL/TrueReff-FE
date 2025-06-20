import Loader from "@/app/_components/components-common/layout/loader";
import VendorLanding from "@/app/_landingpage/vendor_landing_main";
import React, { Suspense } from "react";


export default function VendorLandingPage() {
  return (
    <Suspense fallback={<Loader/>}>
      <VendorLanding />
    </Suspense>
  );
}