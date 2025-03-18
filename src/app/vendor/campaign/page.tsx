import CampaignList from "@/app/_components/pages/campaigns/list";
import React, { Suspense } from "react";


export default function AddProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CampaignList />
        </Suspense>
    )
}