import React from "react";
import PreFormPage from "../../_components/pages/pre-form";
import AuthenticatedLayout from "@/app/_components/components-common/authenticated-layout";

export default function page() {
  console.log("vendor register page");
  return (
    // <AuthenticatedLayout isPreForm={true}>
      <PreFormPage />
    // </AuthenticatedLayout>
  );
}
