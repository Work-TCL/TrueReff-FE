import React, { Suspense } from "react";
import CreatorRegistration from "../../_components/pages/creator-registration";
import { getCreatorProgress } from "@/lib/web-api/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const creatorDetails = await getCreatorProgress();

  if (
    Boolean(creatorDetails?.creatorFilled) &&
    Boolean(creatorDetails?.channelesFilled)
  ) {
    redirect("/creator/dashboard");
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatorRegistration creatorDetails={creatorDetails} />
    </Suspense>
  );
}
