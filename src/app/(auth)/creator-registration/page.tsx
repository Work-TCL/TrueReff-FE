import React, { Suspense } from "react";
import CreatorRegistration from "../../_components/pages/creator-registration";

export default async function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatorRegistration />
    </Suspense>
  );
}
