"use client";
import React, { useEffect, useState } from "react";
import CollabsWithCompanies from "./CollabsWithCompanies";
import { useParams } from "next/navigation";
import { useCreatorStore } from "@/lib/store/creator";
import { getCreatorById } from "@/lib/web-api/creator";
import Loader from "../../components-common/layout/loader";
import ProductList from "@/app/(public)/store/[storeName]/product-list";
import ProfileCard from "./profile-card";
interface ICreatorProfileProps {
  isVendor?: boolean;
}
export default function CreatorProfile({ isVendor }: ICreatorProfileProps) {
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
    <div className="flex flex-col p-2 md:p-4 gap-2 md:gap-5">
      {isLoading && <Loader isTransparent={false} />}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-5 w-full z-10 transition-transform duration-500">
        <ProfileCard
          banner_image={creatorData.banner_image}
          profile_image={creatorData.profile_image}
          full_name={creatorData.full_name}
          user_name={creatorData.user_name}
          // short_description={creatorData.store_name}
          long_description={creatorData.store_description}
          tags={creatorData.tags}
          channels={{
            youtube_link: creatorData.youtube_link,
            instagram_link: creatorData.instagram_link,
            instagramFollowers: creatorData?.channels?.find(
              (v: any) => v?.channelType === "instagram"
              // @ts-ignore
            )?.followers,
            youtubeFollowers: creatorData?.channels?.find(
              (v: any) => v?.channelType === "youtube"
              // @ts-ignore
            )?.followers,
          }}
          store_name={creatorData?.store_name}
          categories={[...creatorData.category.map((v: any) => v.name)]}
          store_link={
            isVendor ? `/vendor/creator-store/${creatorData?.store_name}` : ""
          }
        />
        <div className="flex flex-col gap-2 md:gap-5">
          <CollabsWithCompanies />
        </div>
      </div>
      <div className="overflow-y-auto">
        <ProductList storeName={creatorData?.store_name} showTrending={false} />
      </div>
    </div>
  );
}
