import React, { Suspense } from "react";
import Loader from "@/app/_components/components-common/layout/loader";
import Landing from "./_component/landing";


export default function DashboardPage(){
    return (
        <Suspense fallback={<Loader/>}>
            <Landing/>
        </Suspense>
    )
}