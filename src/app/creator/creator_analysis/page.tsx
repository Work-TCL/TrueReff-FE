import CreatorAnalysis from "@/app/_components/pages/creator_analysis";
import React, { Suspense } from "react";


export default function CreatorAnalysisPage(){
    return <Suspense fallback={<div>Loading...</div>}>
        <CreatorAnalysis/>
    </Suspense>
}