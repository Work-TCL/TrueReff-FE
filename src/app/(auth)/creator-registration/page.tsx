import React, { Suspense } from "react";
import CreatorRegistration from "../../_components/pages/creator-registration";
import Loader from "@/app/_components/components-common/layout/loader";

export default async function page() {
  return (
    <Suspense fallback={<Loader />}>
      <CreatorRegistration />
    </Suspense>
  );
}
