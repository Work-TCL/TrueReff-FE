import React, { Suspense } from "react";
import PreFormPage from "../../_components/pages/pre-form";
import Loader from "@/app/_components/components-common/layout/loader";
import Header from "@/app/_components/components-common/layout/dashboard/header";

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header/>
      <PreFormPage />
      </div>
    </Suspense>
  );
}
