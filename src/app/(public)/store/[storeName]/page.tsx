import React, { Suspense } from "react";
import Loader from "@/app/_components/components-common/layout/loader";
import PublicCreatorStore from "./main";
import Header from "@/app/_components/components-common/public-layout/header";

export default function CreatorStorePage() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex h-screen overflow-hidden">
        {/* <Sidebar handleExpandSidebar={handleExpandSidebar} expanded={expanded} /> */}
        <main className="flex-1 w-full h-full overflow-hidden flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto"><PublicCreatorStore /></div>
        </main>
      </div>
    </Suspense>
  );
}
