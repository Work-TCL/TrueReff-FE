import ViewCreatorDetail from "@/app/_components/pages/creator/ViewCreatorDetail";
import React, { Suspense } from "react";

export default function ViewCreatorDetailPage (){
    return  <Suspense fallback={<div>Loading...</div>}>
        <ViewCreatorDetail/>
    </Suspense>
}