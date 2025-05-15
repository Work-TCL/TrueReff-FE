import Loader from "@/app/_components/components-common/layout/loader";
import CreatorProfile from "@/app/_components/pages/creator-profile";
import React, { Suspense } from "react";

export default function CreatorProfilePage() {
  return (
    <Suspense fallback={<Loader />}>
      <CreatorProfile />
    </Suspense>
  );
}
