"use client";
import ChannelCard from "@/app/_components/components-common/channel-card";
import ShopifyStoreConnects from "@/app/_components/pages/settings/components/shopify-connect-form";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import LoadingPage from "@/lib/components/loading-page";
import { IChannel } from "@/lib/types-api/vendor";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React, { useEffect, useState, useTransition } from "react";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const res: any[] = await getConnectedChannelsList();
      if (Array.isArray(res)) {
        setChannels(res);
      }
    });
  }, []);
  return (
    <>
      {isPending && <LoadingPage />}
      <StoreConnects
        className="md:w-2/3 lg:w-1/2 bg-white rounded-xl shadow-md"
        channels={Array.isArray(channels) ? channels : []}
        StoreConnectsComponent={() => <ShopifyStoreConnects />}
        ChannelCardComponent={(value: IChannel) => (
          <ChannelCard
            channelConfig={{
              name: value?.channelConfig?.name,
              domain: value?.channelConfig?.domain,
            }}
            channelStatus={value?.channelStatus}
            channelType={value?.channelType}
          />
        )}
      />
    </>
  );
}
