"use client";
import ChannelCard from "@/app/_components/components-common/channel-card";
import ShopifyStoreConnects from "@/app/_components/pages/settings/components/shopify-connect-form";
import StoreConnects from "@/app/_components/pages/settings/store-connects";
import LoadingPage from "@/lib/components/loading-page";
import { IChannel } from "@/lib/types-api/vendor";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StoreConnect() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getConnectedChannel();
  }, []);
  const getConnectedChannel = async () => {
    setLoading(true);
    try {
        const res: any[] = await getConnectedChannelsList();
      if (Array.isArray(res)) {
        setChannels(res);
        setLoading(false)
      } else {
        setChannels([]);
        setLoading(false)
      }
    }catch (error){
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
    }
  }
  
  return (
    <>
      {loading && <LoadingPage />}
      <StoreConnects
        className="md:w-2/3 lg:w-1/2 bg-white rounded-xl shadow-md"
        channels={Array.isArray(channels) ? channels : []}
        StoreConnectsComponent={() => <ShopifyStoreConnects getConnectedChannel={getConnectedChannel}/>}
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
