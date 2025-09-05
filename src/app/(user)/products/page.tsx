import Loader from "@/app/_components/components-common/layout/loader";
import React, { Suspense } from "react";
import ProductList from "./_components/product-list";


export default function ProductPage(){
    return <Suspense fallback={<Loader/>}>
        <ProductList storeName="naveenstore" showTrending={true}/>
    </Suspense>
}