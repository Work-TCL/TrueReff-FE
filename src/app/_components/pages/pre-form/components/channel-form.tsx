"use client";
// import ChannelCard from "@/app/_components/components-common/channel-card";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { IChannel } from "@/lib/types-api/vendor";
import { useTranslations } from "next-intl";
import React from "react";
import { useFormContext } from "react-hook-form";
const Options = [
  {
    label: "Flipkart",
    value: "Flipkart",
  },
  {
    label: "Amezone",
    value: "Amezone",
  },
  {
    label: "Meesho",
    value: "Meesho",
  },
];
interface IChannelFormProps {
  loading: boolean;
  channels: any[];
}
interface IChannelTypes {
  icon: string;
  name: string;
  inputName: string;
}
const channelsTypes:IChannelTypes[] = [
  {
    icon: "/assets/vendor/shopify-image.png",
    name: "shopify",
    inputName: "shopify_store_id"
  }
]
export default function ChannelForm({ loading, channels }: IChannelFormProps) {
  const translate = useTranslations();
  const getChannel = (channelName: string) => {
    return channels?.find(ele => ele?.channelType === channelName) ?? null;
  }
  return (
    <>
      {channelsTypes.map((ele:IChannelTypes,index:number) => {
        const channel = getChannel(ele?.name);
        return (
          <div key={`${ele?.name}-${index}`} className="mb-1 ml-6 relative">
            <div className="absolute -left-6 top-0 w-12 h-12 bg-dark-orange rounded-full flex items-center justify-center shadow-lg">
              <img
                src={ele?.icon}
                alt="YouTube"
                className="w-7 h-7 rounded-2xl"
              />
            </div>
            <div className="bg-gray-light flex flex-col gap-2 p-6 rounded-20 shadow-md">
              {!channel && <h3 className="font-semibold">{translate("Shopify_Store_Connect")}</h3>}
              {!channel && <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 gap-4 items-end">
                <div className="sm:col-span-6 md:col-span-4 w-full">
                  <Input
                    label={translate("Shopify_Store_Domain")}
                    placeholder="Enter your Shopify store domain"
                    name={`shopify_store_domain`}
                    type="text"
                    disabled={loading}
                    autoFocus={true}
                  />
                </div>
                <div className="sm:col-span-6 md:col-span-4 w-full">
                  <Input
                    label={translate("Shopify_Store_Id")}
                    placeholder="Enter your Shopify store ID"
                    name={`shopify_store_id`}
                    type="text"
                    disabled={loading}
                    autoFocus={false}
                  />
                </div>
                <div className="sm:col-span-1 md:col-span-1 w-full">
                  <Button
                    type="submit"
                    loading={loading}
                    className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    {translate("Connect")}
                  </Button>
                </div>
              </div>}
              {channel && <p className="text-gray-color mb-4 md:text-base text-sm">
                {translate("Shopify_Store_connected")}
              </p>}
              {channel && (
                <div className="text-sm text-gray-color">
                  <div>
                    <strong>{translate("Status")}:</strong>{" "}
                    <span className="bg-[#FFEDF2] text-primary text-[10px] xl:text-xs px-3 py-1 rounded-2xl">
                      {channel?.channelStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </>
  );
}
