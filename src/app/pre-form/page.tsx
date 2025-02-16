import React from "react";
import PreFormPage from "../_components/pre-form";
import AuthenticatedLayout from "@/lib/components/authenticated-layout";

export default function page() {
  return (
    <AuthenticatedLayout isPreForm={true}>
      <PreFormPage />
    </AuthenticatedLayout>
  );
}
