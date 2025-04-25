"use client";
import React, { useEffect, useState } from "react";
import InfluencerProfile from "./InfluencerProfile";
import CollabsWithCompanies from "./CollabsWithCompanies";
import TopVideosCraetor from "../../components-common/tables/topVideos";
import TopViewAcrossPlatforms from "../../components-common/charts/topViewAcrossPlatforms";
import { useParams } from "next/navigation";
import { useCreatorStore } from "@/lib/store/creator";
import { getCreatorById } from "@/lib/web-api/creator";
import Loader from "../../components-common/layout/loader";

export default function CreatorProfile() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { creator } = useCreatorStore();
  const [creatorData, setCreatorData] = useState(creator);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response: any = await getCreatorById({ id: String(id) });
        if (response?.status === 200) setCreatorData(response?.data?.creator);
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
          banner_image={creatorData.banner_image}
          profile_image={creatorData.profile_image}
          full_name={creatorData.full_name}
          user_name={creatorData.user_name}
          short_description={creatorData.short_description}
          long_description={creatorData.long_description}
          tags={creatorData.tags}
          categories={[...creatorData.category.map((v: any) => v.name)]}
        />
        <div className="flex flex-col gap-5">
          {/* {creator?.creatorId === creatorData?.creatorId <ProfileCompletionCard progress={60} />} */}
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
