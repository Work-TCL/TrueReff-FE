import React, { Suspense } from "react";
import ProductList from "@/app/_components/pages/products/list";
import Loader from "@/app/_components/components-common/layout/loader";

export default function ProductListPage() {
  return <Suspense fallback={<Loader/>}><ProductList /></Suspense>;
}
