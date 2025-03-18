// import ProductManagement from "@/app/_components/pages/product-management";
import React, { Suspense } from "react";


export default function ProductManagementPage(){
    return <Suspense fallback={<div>Loading...</div>}>
        {/* <ProductManagement/> */}
        <h1>hello</h1>
    </Suspense>
}