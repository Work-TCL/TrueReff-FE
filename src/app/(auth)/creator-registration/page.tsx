import React, { Suspense } from "react";
import CreatorRegistration from "../../_components/pages/creator-registration";
import Loader from "@/app/_components/components-common/layout/loader";
import Header from "@/app/_components/components-common/layout/dashboard/header";

export default async function page() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex flex-col h-screen overflow-hidden">
      <Header/>
      <CreatorRegistration />
      </div>
    </Suspense>
  );
}
