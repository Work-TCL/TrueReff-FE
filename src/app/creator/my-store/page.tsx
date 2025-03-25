import Loader from "@/app/_components/components-common/layout/loader";
import ProductList from "@/app/_components/pages/my-store/product-list";
import React, { Suspense } from "react";

export default function MyStorePage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductList />
    </Suspense>
  );
}
