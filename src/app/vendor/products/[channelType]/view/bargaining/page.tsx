"use client";

import dynamic from "next/dynamic";
import React from "react";
const BarganingView = dynamic(
  () => import("@/app/_components/pages/products/barganing/view"),
  { ssr: false }
);

export default function page() {
  return <></>;
}
