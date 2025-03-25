import React, { Suspense } from "react";
import CreatorRegistration from "../../_components/pages/creator-registration";
import { getCreatorProgress } from "@/lib/web-api/auth";
import { redirect } from "next/navigation";
import Loader from "@/app/_components/components-common/layout/loader";

export default async function page() {
  const creatorDetails = await getCreatorProgress();

  if (
    Boolean(creatorDetails?.creatorFilled) &&
    Boolean(creatorDetails?.channelesFilled)
  ) {
    redirect("/creator/dashboard");
  }
  return (
    <Suspense fallback={<Loader />}>
      <CreatorRegistration creatorDetails={creatorDetails} />
    </Suspense>
  );
}
