import CreatorList from "@/app/_components/pages/creator/list";
import React, { Suspense } from "react";

export default function CreatorPage(){
    return <Suspense fallback={<div>Loading...</div>}>
        <CreatorList />
    </Suspense>
}