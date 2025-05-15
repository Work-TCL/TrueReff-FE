import Loader from "@/app/_components/components-common/layout/loader";
import React, { Suspense } from "react";
import CreatorList from "./main";


export default function CreatorsPage(){
    return <Suspense fallback={<Loader/>}><CreatorList/></Suspense>
}