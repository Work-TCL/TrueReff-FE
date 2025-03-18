import React, { Suspense } from "react";
import PreFormPage from "../../_components/pages/pre-form";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreFormPage />
    </Suspense>
  );
}
