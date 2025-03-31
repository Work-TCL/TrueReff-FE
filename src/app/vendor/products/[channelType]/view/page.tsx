"use client";
import React from "react";
import dynamic from "next/dynamic";
import ViewProductDetail from "@/app/_components/pages/products/viewProduct/viewDetailProduct";

const CreateProduct = dynamic(
  () => import("@/app/_components/pages/products/channels/create"),
  { ssr: false }
);

export default function ProductDetail() {
  return <ViewProductDetail />;
}
