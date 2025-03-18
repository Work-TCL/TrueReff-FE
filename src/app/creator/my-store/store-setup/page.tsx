import StoreSetUp from "@/app/_components/pages/my-store/store-set-up";
import React, { Suspense } from "react";

export default function StoreSetUpPage() {
    return <Suspense fallback={<div>Loading...</div>}>
        <StoreSetUp />
    </Suspense>
}