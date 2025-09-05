import Loader from "@/app/_components/components-common/layout/loader";
import Header from "@/app/_components/components-common/public-layout/header";
import React, { Suspense } from "react";
import ViewProductDetail from "./main";


export default function ProductDetailPage() {
    return <Suspense fallback={<Loader />}>
        <div className="flex h-screen overflow-hidden">
            {/* <Sidebar handleExpandSidebar={handleExpandSidebar} expanded={expanded} /> */}
            <main className="flex-1 w-full h-full overflow-hidden flex flex-col">
                <Header />
                <div className="flex-1 overflow-auto"><ViewProductDetail isFromPublic={true} /></div>
            </main>
        </div>
    </Suspense>
}