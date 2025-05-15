import Loader from "@/app/_components/components-common/layout/loader";
import BrandList from "./list";
import React, { Suspense } from "react";

export default function Main() {
  return (
    <Suspense fallback={<Loader />}>
      <BrandList />
    </Suspense>
  );
}
