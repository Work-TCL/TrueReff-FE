"use client";
import React from "react";
import dynamic from "next/dynamic";

const ProductView = dynamic(
  () => import("@/app/_components/pages/products/view-products"),
  { ssr: false }
);

export default function ProductDetail() {
  return <ProductView type={"view"} />;
}
