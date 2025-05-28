import PublicCreatorStore from "@/app/(public)/store/[storeName]/main";
import Loader from "@/app/_components/components-common/layout/loader";
import React, { Suspense } from "react";

export default function CreatorStorePage() {
  return (
    <Suspense fallback={<Loader />}>
        <PublicCreatorStore />
    </Suspense>
  );
}
