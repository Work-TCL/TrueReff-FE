"use client";

import React, { useEffect } from "react";
import { useRouter,usePathname } from "next/navigation";

export default function Landing(){
    const pathName = usePathname();
    const router = useRouter();
    useEffect(()=> {
        if(pathName === "/"){
            router.push("/login")
        }
    },[])
    return <h1>Loading...</h1>
}