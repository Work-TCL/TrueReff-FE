import React from "react";
import CreatorRegistration from "../_components/pages/creator-registration";
import AuthenticatedLayout from "@/app/_components/components-common/authenticated-layout";
import { getProfileAPI } from "@/lib/web-api/user";

export default async function page() {
  try {
    const user = await getProfileAPI();
    return (
      <AuthenticatedLayout isPreForm={true}>
        <CreatorRegistration profile={user} />
      </AuthenticatedLayout>
    );
  } catch (e) {
    console.log("while onboarding of creator");
    return null;
  }
}
