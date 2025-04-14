import React, { Suspense } from "react";
import Dashboard from "./_component/Dashboard";
import Loader from "../_components/components-common/layout/loader";
import Header from "../_components/components-common/layout/dashboard/header";


export default function DashboardPage(){
    return (
        <Suspense fallback={<Loader/>}>
            <Header/>
            <Dashboard/>
        </Suspense>
    )
}