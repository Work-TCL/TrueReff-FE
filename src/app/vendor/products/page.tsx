import ProductList from "@/app/_components/pages/products/list";
import React, { Suspense } from "react";


export default function ProductListPage (){
    return <Suspense fallback={<div>Loading...</div>}>
        <ProductList/>
    </Suspense>
}