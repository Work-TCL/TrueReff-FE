import CreatorProfile from "@/app/_components/pages/creator-profile";
import React, { Suspense } from "react";


export default function CreatorProfilePage(){
    return <Suspense fallback={<div>Loading...</div>}>
        <CreatorProfile/>
    </Suspense>
}