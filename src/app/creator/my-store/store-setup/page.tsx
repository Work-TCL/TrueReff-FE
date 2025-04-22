import Loader from "@/app/_components/components-common/layout/loader";
// import StoreDetailView from "@/app/_components/pages/my-store/store-detail-view";
import StoreSetUp from "@/app/_components/pages/my-store/store-set-up";
import React, { Suspense } from "react";

export default function StoreSetUpPage() {
  return (
    <Suspense fallback={<Loader />}>
      <StoreSetUp />
      {/* <StoreDetailView
        store={{
          name: "Men’s Style Hub",
          description:
            "I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!",
          tags: ["fashion", "men", "style", "grooming"],
          category: ["Clothing", "Accessories"],
          link: "https://mens-style-hub.com",
          profile_image:
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          banner_image:
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        }}
      /> */}
    </Suspense>
  );
}
