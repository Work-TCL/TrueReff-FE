import React from "react";
import { IChannel } from "@/lib/types-api/vendor";
import { useTranslations } from "next-intl";

interface IStoreConnects {
  channels: IChannel[];
  className?: string;
  ChannelCardComponent: any;
  StoreConnectsComponent?: any;
}

export default function StoreConnects({
  channels = [],
  className = "",
  ChannelCardComponent = () => {},
  StoreConnectsComponent = () => {},
}: IStoreConnects) {
  const translate = useTranslations();
  return (
    <div
      className={`flex flex-col w-full h-full rounded-xl p-4 gap-2 ${className}`}
    >
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-sm xl:text-lg font-semibold">
          {Array.isArray(channels) && channels.length > 0
            ? translate("channels_connected")
            : translate("store_integration")}
        </h2>
      </div>
      {channels.length > 0 ? (
        channels?.map((value, index) => {
          return ChannelCardComponent && ChannelCardComponent(value);
        })
      ) : (
        <StoreConnectsComponent />
      )}
    </div>
  );
}
