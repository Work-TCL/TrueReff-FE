"use client";
// import ChannelCard from "@/app/_components/components-common/channel-card";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { IChannel } from "@/lib/types-api/vendor";
import { cn } from "@/lib/utils/commonUtils";
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
  bgColor: string;
}
const channelsTypes: IChannelTypes[] = [
  {
    icon: "/assets/vendor/word-press.webp",
    name: "wordpress",
    inputName: "wordpress_store_id",
    bgColor: "bg-gradient-to-r from-[#21759B]  to-[#6EC1E4]",
  },
];
export default function WordPressChannelForm({
  loading,
  channels,
}: IChannelFormProps) {
  const translate = useTranslations();
  const getChannel = (channelName: string) => {
    return channels?.find((ele) => ele?.channelType === channelName) ?? null;
  };
  const handleDownloadZip = () => {
    typeof window !== undefined && window.open("/truereff.zip", "_blank");
  };
  return (
    <>
      {channelsTypes.map((ele: IChannelTypes, index: number) => {
        const channel = getChannel(ele?.name);
        return (
          <div key={`${ele?.name}-${index}`} className="mb-1 ml-6 relative">
            <div className="absolute -left-6 top-0 xsmobile:w-9 xsmobile:h-9 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <img
                src={ele?.icon}
                alt="YouTube"
                className="w-7 h-7 object-contain rounded-2xl"
              />
            </div>
            <div
              className={cn(
                "bg-gray-dark flex flex-col gap-2 p-6 xsmobile:p-4 rounded-20 shadow-md",
                ele?.bgColor
              )}
            >
              {!channel && (
                <h3 className="font-semibold">
                  {translate("WordPress_Store_Connect")}
                </h3>
              )}
              {!channel && (
                <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 gap-4 items-end">
                  <div className="sm:col-span-6 md:col-span-4 w-full">
                    <Input
                      label={translate("WordPress_Store_Domain")}
                      placeholder="Enter your WordPress store domain"
                      name={`wordpress_store_domain`}
                      type="text"
                      disabled={loading}
                      lableClassName="sm:text-md font-[400] text-dark-100"
                      autoFocus={false}
                    />
                  </div>
                  <div className="sm:col-span-6 md:col-span-4 w-full">
                    <Input
                      label={translate("WordPress_Store_Id")}
                      placeholder="Enter your WordPress store ID"
                      name={`wordpress_store_id`}
                      type="text"
                      disabled={loading}
                      lableClassName="sm:text-md font-[400] text-dark-100"
                      autoFocus={false}
                    />
                  </div>
                  <div className="sm:col-span-3 2xl:col-span-3 xl:col-span-3 lg:col-span-4 md:col-span-5 w-full flex  xsmobile:flex-col items-center gap-5 xsmobile:gap-2">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm px-4"
                    >
                      {translate("Connect")}
                    </Button>
                    <Button
                      type="button"
                      className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm px-4"
                      onClick={handleDownloadZip}
                    >
                      {translate("Download")}
                    </Button>
                  </div>
                </div>
              )}
              {channel && (
                <p className="text-gray-100 mb-4 md:text-base text-sm">
                  {translate("WordPress_Store_connected")}
                </p>
              )}
              {channel && (
                <div className="text-sm text-gray-100">
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
        );
      })}
    </>
  );
}
