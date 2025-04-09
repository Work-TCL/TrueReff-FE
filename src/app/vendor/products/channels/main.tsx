
import ChannelCard from "@/app/_components/components-common/channel-card";
import StoreConnectsRedirect from "@/app/_components/pages/products/store-connect";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import { IChannel } from "@/lib/types-api/vendor";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React from "react";

export const dynamic = 'force-dynamic';
export default async function Channels() {
  const channels = await getConnectedChannelsList();
  return channels.length > 0 ? (
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
    <div className="flex-1 h-full flex justify-center items-center">
      <StoreConnectsRedirect />
    </div>
  );
}
