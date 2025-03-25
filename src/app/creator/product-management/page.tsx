// import ProductManagement from "@/app/_components/pages/product-management";
import Loader from "@/app/_components/components-common/layout/loader";
import React, { Suspense } from "react";

export default function ProductManagementPage() {
  return (
    <Suspense fallback={<Loader />}>
      {/* <ProductManagement/> */}
      <h1>hello</h1>
    </Suspense>
  );
}
