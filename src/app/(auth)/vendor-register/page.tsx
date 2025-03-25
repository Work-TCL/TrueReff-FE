import React, { Suspense } from "react";
import PreFormPage from "../../_components/pages/pre-form";
import Loader from "@/app/_components/components-common/layout/loader";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <PreFormPage />
    </Suspense>
  );
}
