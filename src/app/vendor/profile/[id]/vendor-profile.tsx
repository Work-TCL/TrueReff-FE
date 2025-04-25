"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/app/_components/components-common/layout/loader";
import InfluencerProfile from "@/app/_components/pages/creator-profile/InfluencerProfile";
import CollabsWithCompanies from "@/app/_components/pages/creator-profile/CollabsWithCompanies";
import TopVideosCraetor from "@/app/_components/components-common/tables/topVideos";
import TopViewAcrossPlatforms from "@/app/_components/components-common/charts/topViewAcrossPlatforms";
import { getVendorById } from "@/lib/web-api/vendor";
import { useVendorStore } from "@/lib/store/vendor";
import { IVendor, IVendorUpdate } from "@/lib/types-api/vendor";

export default function VendorProfile() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { vendor } = useVendorStore();
  const [vendorData, setCreatorData] = useState<IVendor|IVendorUpdate>(vendor);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response: any = await getVendorById({ id: String(id) });
        if (response?.status === 200) setCreatorData(response?.data?.vendor);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col p-4 gap-5">
      {isLoading && <Loader isTransparent={false} />}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <InfluencerProfile
          banner_image={vendorData.banner_image}
          profile_image={vendorData.profile_image}
          full_name={vendorData.business_name}
          user_name={vendorData.user_name}
          short_description={vendorData.short_description}
          long_description={vendorData.long_description}
          tags={vendorData.omni_channels}
        />
        <div className="flex flex-col gap-5">
          {/* <ProfileCompletionCard progress={60} /> */}
          <CollabsWithCompanies />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 md:gap-5 gap-0 w-full">
        <div className="col-span-2 h-full">
          <TopVideosCraetor />
        </div>
        <div className="h-full">
          <TopViewAcrossPlatforms />
        </div>
      </div>
    </div>
  );
}
