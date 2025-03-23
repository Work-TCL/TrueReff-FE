import ChannelCard from "@/app/_components/components-common/channel-card";
import ShopifyStoreConnects from "@/app/_components/pages/settings/components/shopify-connect-form";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import { IChannel } from "@/lib/types-api/vendor";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React from "react";

export default async function Page() {
  const channels = await getConnectedChannelsList();
  return (
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
  );
}
