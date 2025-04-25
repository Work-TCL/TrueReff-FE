import React, { Suspense } from "react";
import Loader from "@/app/_components/components-common/layout/loader";
import PublicCreatorStore from "./main";

export  default function CreatorStorePage(){
    return <Suspense fallback={<Loader/>}><PublicCreatorStore/></Suspense>
}