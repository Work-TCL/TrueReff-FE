"use client";
import React from "react";
import dynamic from "next/dynamic";

const CreateProduct = dynamic(
  () => import("@/app/_components/pages/products/channels/create"),
  { ssr: false }
);

export default function ProductDetail() {
  return <CreateProduct type={"view"} />;
}
