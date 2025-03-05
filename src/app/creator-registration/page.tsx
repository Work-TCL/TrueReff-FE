import React from "react";
import CreatorRegistration from "../_components/pages/creator-registration";
import AuthenticatedLayout from "@/app/_components/components-common/authenticated-layout";

export default function page() {
  return (
    <AuthenticatedLayout isPreForm={true}>
      <CreatorRegistration />
    </AuthenticatedLayout>
  );
}
