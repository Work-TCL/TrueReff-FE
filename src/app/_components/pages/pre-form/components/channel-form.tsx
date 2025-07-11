"use client";
import ToolTip from "@/app/_components/components-common/tool-tip";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { cn } from "@/lib/utils/commonUtils";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
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
  methods: any;
}
interface IChannelTypes {
  icon: string;
  name: string;
  inputName: string;
  bgColor: string;
}
const channelsTypes: IChannelTypes[] = [
  {
    icon: "/assets/vendor/shopify-image.png",
    name: "shopify",
    inputName: "shopify_store_id",
    bgColor: "bg-gradient-to-r from-[#C8E6A3] via-[#4B7035] to-[#7FB743]"
  },
]
export default function ChannelForm({ loading, channels,methods }: IChannelFormProps) {
  const translate = useTranslations();
  const [installed,setInstalled] = useState<boolean>(false)
  const getChannel = (channelName: string) => {
    return channels?.find(ele => ele?.channelType === channelName) ?? null;
  }
  const handleOnClick = async () => {
    const profileSetUpFields: string[] = ["shopify_store_domain"];
    const isValid = await methods.trigger(profileSetUpFields);
    if (isValid) {
      setInstalled(true);
      typeof window !== "undefined" && window.open(`${process.env.NEXT_PUBLIC_SHOPIFY_URL}?shop=${methods.watch("shopify_store_domain")}`, '_blank');
    } else {
      setInstalled(false);
    }
  }
  return (
    <>
      {channelsTypes.map((ele: IChannelTypes, index: number) => {
        const channel = getChannel(ele?.name);
        return (
          <div key={`${ele?.name}-${index}`} className="mb-1 ml-6 relative">
            <div className="absolute -left-6 top-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <img
                src={ele?.icon}
                alt="shopify"
                className="w-7 h-7 object-contain rounded-2xl"
              />
            </div>
            <div className={cn("bg-gray-dark flex flex-col gap-2 p-6 rounded-20 shadow-md",ele?.bgColor)}>
              {!channel && <div className="flex items-center space-x-2"><h3 className="font-semibold">{translate("Shopify_Store_Connect")} </h3><ToolTip content={<div className="max-w-[200px] text-sm text-wrap p-2 rounded-lg">{translate("Shopify_store_connect_info")}</div>} ><InfoIcon/></ToolTip></div>}
              {!channel && (!installed ? <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 gap-4 items-start">
                <div className="sm:col-span-6 md:col-span-6 w-full">
                  <Input
                    label={translate("Shopify_Store_Domain")}
                    placeholder="Enter your Shopify store domain"
                    name={`shopify_store_domain`}
                    type="text"
                    disabled={loading}
                    lableClassName="text-md font-[400] text-dark-100"
                    autoFocus={true}
                  />
                </div>
                <div className="sm:col-span-6 md:col-span-2 w-full md:mt-7">
                  <Button
                    type="button"
                    loading={loading}
                    className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm"
                    onClick={() => handleOnClick()}
                  >
                    {translate("Install")}
                  </Button>
                </div>
              </div> : <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 gap-4">
                <div className="sm:col-span-6 md:col-span-4 w-full">
                  <Input
                    label={translate("Shopify_Store_Domain")}
                    placeholder="Enter your Shopify store domain"
                    name={`shopify_store_domain`}
                    type="text"
                    disabled={loading}
                    lableClassName="text-md font-[400] text-dark-100"
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
                    lableClassName="text-md font-[400] text-dark-100"
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
              </div>)}
              {channel && <p className="text-gray-100 mb-4 md:text-base text-sm">
                {translate("Shopify_Store_connected")}
              </p>}
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
        )
      })}
    </>
  );
}
