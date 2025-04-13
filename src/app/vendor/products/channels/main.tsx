"use client";
import ChannelCard from "@/app/_components/components-common/channel-card";
import StoreConnectsRedirect from "@/app/_components/pages/products/store-connect";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import LoadingPage from "@/lib/components/loading-page";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { IChannel } from "@/lib/types-api/vendor";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React, { useEffect, useState, useTransition } from "react";

export default function Channels() {
  const [isPending, startTransition] = useTransition();
  const [channels, setChannels] = useState<any[]>([]);
  const axios = useAxiosAuth();

  useEffect(() => {
    startTransition(async () => {
      const res: any[] = await getConnectedChannelsList(axios);
      if (Array.isArray(res)) {
        setChannels(res);
      }
    });
  }, []);

  return (
    <>
      {isPending && <LoadingPage />}
      {channels.length > 0 ? (
        <StoreConnects
          channels={channels}
          className="m-4 !w-auto !h-auto"
          ChannelCardComponent={(value: IChannel, i: number) => (
            <ChannelCard
              key={i + value?._id}
              href={`/vendor/products/${value.channelType}`}
              channelConfig={{
                name: value?.channelConfig?.name,
                domain: value?.channelConfig?.domain,
              }}
              channelStatus={value?.channelStatus}
              channelType={value?.channelType}
            />
          )}
        />
      ) : (
          <StoreConnectsRedirect />
      )}
    </>
  );
}
