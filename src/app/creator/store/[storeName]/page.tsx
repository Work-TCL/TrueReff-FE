import React, { Suspense } from "react";
import CreatorStore from "../main";
import Loader from "@/app/_components/components-common/layout/loader";

export  default function CreatorStorePage(){
    return <Suspense fallback={<Loader/>}><CreatorStore/></Suspense>
}