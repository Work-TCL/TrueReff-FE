import Loader from "@/app/_components/components-common/layout/loader";
import React, { Suspense } from "react";
import BrandProductList from "./_components/list";

export default function BrandProductListPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BrandProductList/>
    </Suspense>
  );
}
