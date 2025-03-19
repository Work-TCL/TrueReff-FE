
import BrandList from "./list";
import React, { Suspense } from "react";

export default function Main() {
  return <Suspense fallback={<div>Loading...</div>}>
    <BrandList />
  </Suspense>
}
