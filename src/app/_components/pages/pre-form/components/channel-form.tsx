"use client";
import ToolTip from "@/app/_components/components-common/tool-tip";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { cn } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import axios from "@/lib/web-api/axios";
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
    bgColor: "bg-gradient-to-r from-[#7FB743]  to-[#C8E6A3]",
  },
];
export default function ChannelForm({
  loading,
  channels,
  methods,
}: IChannelFormProps) {
  const translate = useTranslations();
  const [installed, setInstalled] = useState<boolean>(false);
  const [shopifyKey, setShopifyKey] = useState<string>("");
  const [keyLoading, setKeyLoading] = useState<boolean>(false);
  const getChannel = (channelName: string) => {
    return channels?.find((ele) => ele?.channelType === channelName) ?? null;
  };
  const handleOnClick = async () => {
    const profileSetUpFields: string[] = ["shopify_store_domain"];
    const isValid = await methods.trigger(profileSetUpFields);
    if (isValid) {
      setInstalled(true);
      typeof window !== "undefined" &&
        window.open(
          `${process.env.NEXT_PUBLIC_SHOPIFY_URL}?shop=${methods.watch(
            "shopify_store_domain"
          )}`,
          "_blank"
        );
    } else {
      setInstalled(false);
    }
  };
  const generateShopifyKey = async () => {
    try {
      const profileSetUpFields: string[] = ["shopify_store_domain"];
      const isValid = await methods.trigger(profileSetUpFields);
      if (isValid) {
        setKeyLoading(true);
        const response = await axios.post("/channel/shopify/generate-key", {
          domain: methods.watch("shopify_store_domain"),
        });
        if (response.status === 200) {
          const data = response?.data?.data;
          setShopifyKey(data?.key);
        } else {
          console.error("Failed to generate Shopify key");
        }
      }
    } catch (error) {
      console.error("Error generating Shopify key:", error);
    } finally {
      setKeyLoading(false);
    }
  };
  const handleCopyShopifyKey = async () => {
    try {
      await navigator.clipboard.writeText(shopifyKey);
      toastMessage.success("Link copied to clipboard!");
    } catch (err) {
      toastMessage.error("Failed to copy!");
    }
  };
  return (
    <>
      {channelsTypes.map((ele: IChannelTypes, index: number) => {
        const channel = getChannel(ele?.name);
        return (
          <div key={`${ele?.name}-${index}`} className="mb-1 ml-6 relative">
            <div className="absolute -left-6 top-0 xsmobile:h-9 xsmobile:w-9 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <img
                src={ele?.icon}
                alt="shopify"
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
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">
                    {translate("Shopify_Store_Connect")}{" "}
                  </h3>
                  <ToolTip
                    content={
                      <div className="max-w-[250px] text-sm text-wrap p-2 rounded-lg">
                        <h2>{translate("Shopify_store_connect_info.title")}</h2>
                        <ol>
                          <li key={1}>{translate("Shopify_store_connect_info.steps.1")}</li>
                          <li key={2}>{translate("Shopify_store_connect_info.steps.2")}</li>
                          <li key={3}>{translate("Shopify_store_connect_info.steps.3")}</li>
                        </ol>
                      </div>
                    }
                  >
                    <InfoIcon />
                  </ToolTip>
                </div>
              )}
              {!channel ? !shopifyKey ? (
                  <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 gap-4 items-start">
                    <div className="sm:col-span-6 md:col-span-6 w-full">
                      <Input
                        label={translate("Shopify_Store_Domain")}
                        placeholder="Enter your Shopify store domain"
                        name={`shopify_store_domain`}
                        type="text"
                        disabled={keyLoading}
                        lableClassName="text-md font-[400] text-dark-100"
                        autoFocus={true}
                      />
                    </div>
                    <div className="sm:col-span-6 md:col-span-2 w-full md:mt-7">
                      <Button
                        type="button"
                        loading={keyLoading}
                        className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm"
                        onClick={() => generateShopifyKey()}
                      >
                        {translate("Generate_key")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-8 gap-4 items-start">
                    <div className="sm:col-span-6 md:col-span-6 w-full">
                      <Input
                        label={translate("Shopify_Store_Domain")}
                        placeholder="Enter your Shopify store domain"
                        name={`shopify_store_domain`}
                        type="text"
                        disabled={(keyLoading || shopifyKey) ? true : false}
                        lableClassName="text-md font-[400] text-dark-100"
                        autoFocus={true}
                      />
                    </div>
                    <div className="sm:col-span-2 md:col-span-2 w-full md:mt-7">
                      <Button
                        type="button"
                        loading={keyLoading}
                        className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm"
                        onClick={() => generateShopifyKey()}
                        disabled={(shopifyKey) ? true : false}
                      >
                        {translate("Generate_key")}
                      </Button>
                    </div>
                    <div className="sm:col-span-6 md:col-span-6 w-full">
                      <Input
                        label={translate("Shopify_Key")}
                        placeholder="Enter your Shopify store ID"
                        name={`shopify_store_id`}
                        type="textarea"
                        disabled={(keyLoading || shopifyKey) ? true : false}
                        lableClassName="text-md font-[400] text-dark-100"
                        value={shopifyKey}
                        required={false}
                      />
                    </div>
                    <div className="sm:col-span-3 md:col-span-2 w-full md:mt-7">
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2 items-center justify-center">
                      <Button
                        type="button"
                        loading={keyLoading}
                        className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm"
                        onClick={() => handleCopyShopifyKey()}
                      >
                        {translate("Copy")}
                      </Button>
                      <Button
                        type="button"
                        loading={keyLoading}
                        className="w-full h-[54px] text-white rounded-lg hover:bg-blue-700 text-sm"
                        onClick={() => handleOnClick()}
                      >
                        {translate("Install")}
                      </Button>
                      </div>
                    </div>
                    <div className="col-span-8 w-full md:mt-2">
                      <div className="text-sm text-primary">
                        <p className="mb-2">
                          {translate("Shopify_Key_Desc")}
                        </p>
                        <p className="mb-2">
                          {translate("Shopify_Connect")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) :  <>
                <p className="text-gray-100 mb-4 md:text-base text-sm">
                  {translate("Shopify_Store_connected")}
                </p>
                <div className="flex flex-col gap-2 text-xs sm:text-sm md:text-xl text-gray-100">
                  <div>
                    <strong>{translate("Domain")}:</strong>{" "}
                    <span className=" text-primary py-1 rounded-2xl">
                      {channel?.channelConfig?.domain}
                    </span>
                  </div>
                  <div>
                    <strong>{translate("Status")}:</strong>{" "}
                    <span className="bg-[#FFEDF2] text-primary text-[10px] xl:text-xs px-3 py-1 rounded-2xl">
                      {"Connected"}
                    </span>
                  </div>
                </div>
              </>}
            </div>
          </div>
        );
      })}
    </>
  );
}
