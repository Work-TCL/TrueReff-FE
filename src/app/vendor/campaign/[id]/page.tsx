import React, { Suspense } from "react";
import CreateCampaign from "@/app/_components/pages/campaigns/create";

export default function DetailsPage() {
    return <Suspense fallback={<div>Loading...</div>}>
        <CreateCampaign />
    </Suspense>
}