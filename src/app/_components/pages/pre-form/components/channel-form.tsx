"use client";
import ToolTip from "@/app/_components/components-common/tool-tip";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { cn } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import axios from "@/lib/web-api/axios";
import { InfoIcon, ChevronDown, ChevronUp, Copy, ExternalLink, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface IChannelFormProps {
  loading: boolean;
  channels: any[];
  methods: any;
}

const channelsTypes = [
  {
    icon: "/assets/vendor/shopify-image.png",
    name: "shopify",
    inputName: "shopify_store_id",
    bgColor: "bg-slate-800",
  },
];

// FIX: Added image property to stepData and rendered it if present
const StepItem = ({ step, stepData }: {
  step: number; stepData: any;
}) => (
  <div className="flex gap-3 mb-4">
    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0 mt-0.5">
      {step}
    </div>
    <div className="flex-1">
      <h5 className="text-sm font-semibold text-white mb-2">{stepData?.title}</h5>
      {stepData?.substeps && stepData.substeps.length > 0 && (
        <ul className="space-y-1 ml-4">
          {stepData.substeps.map((substep: string, index: number) => (
            <li key={index} className="text-sm text-slate-300 relative">
              <span className="absolute -left-4 top-1 w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              {substep}
            </li>
          ))}
        </ul>
      )}
      {/* Conditionally render an image if the URL is provided in your translation file */}
      {stepData.image && (
        <div className="mt-3">
            <img src={stepData.image} alt={`Step ${step} visual guide`} className="rounded-lg border border-slate-500 w-full object-contain" />
        </div>
      )}
    </div>
  </div>
);

export default function ChannelForm({ loading, channels, methods }: IChannelFormProps) {
  const translate = useTranslations();
  const [installed, setInstalled] = useState<boolean>(false);
  const [shopifyKey, setShopifyKey] = useState<string>("");
  const [keyLoading, setKeyLoading] = useState<boolean>(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const getChannel = (channelName: string) => {
    return channels?.find((ele) => ele?.channelType === channelName) ?? null;
  };

  const handleAccordionToggle = (channelName: string) => {
    setExpandedAccordion(expandedAccordion === channelName ? null : channelName);
  };

  const handleOnClick = async () => {
    const profileSetUpFields: string[] = ["shopify_store_domain"];
    const isValid = await methods.trigger(profileSetUpFields);
    if (isValid) {
      setInstalled(true);
      typeof window !== "undefined" &&
        window.open(`${process.env.NEXT_PUBLIC_SHOPIFY_URL}?shop=${methods.watch("shopify_store_domain")}`, "_blank");
    } else {
      setInstalled(false);
    }
  };

  const generateShopifyKey = async () => {
    try {
      setKeyLoading(true);
      const response = await axios.post("/channel/shopify/generate-key", {});
      if (response.status === 200) {
        setShopifyKey(response?.data?.data?.key);
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
      setCopied(true);
      toastMessage.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toastMessage.error("Failed to copy!");
    }
  };

  return (
    <>
      {channelsTypes.map((ele, index) => {
        const channel = getChannel(ele?.name);
        const isExpanded = expandedAccordion === ele?.name;

        return (
          <div key={`${ele?.name}-${index}`} className="mb-6 ml-6 relative">
            {/* Icon */}
            <div className="absolute -left-6 top-0 w-12 h-12 xsmobile:w-10 xsmobile:h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-200">
              <img src={ele?.icon} alt="shopify" className="w-7 h-7 object-contain" />
            </div>

            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between p-4 xsmobile:p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all border border-slate-600",
                ele?.bgColor
              )}
              onClick={() => handleAccordionToggle(ele?.name)}
            >
              <h3 className="font-semibold text-white pl-3">{translate("Shopify_Store_Connect")}</h3>
              <div className="flex items-center gap-3">
                {channel && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    Connected
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className={cn(
              "transition-all duration-300 overflow-hidden",
              isExpanded ? "max-h-[2500px] opacity-100 mt-3" : "max-h-0 opacity-0" // Increased max-h for images
            )}>
              <div className={cn("p-6 xsmobile:p-4 rounded-xl shadow-sm border border-slate-600", ele?.bgColor)}>
              {!channel ? !shopifyKey ? (
                  <div className="text-center">
                    <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-4">
                      <h4 className="text-white font-semibold mb-2">Generate Connection Key</h4>
                      <p className="text-slate-300 text-sm mb-4">Create your unique key to connect Shopify store</p>
                      <Button
                        type="button"
                        loading={keyLoading}
                        className="bg-slate-600 hover:bg-slate-800 text-white px-6 py-2 rounded-lg"
                        onClick={generateShopifyKey}
                      >
                        {translate("Generate_key")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Key Generated
                  <div className="space-y-4">
                    <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                      <label className="text-white font-medium mb-2 block">{translate("Shopify_Key")}</label>
                      <textarea
                        value={shopifyKey}
                        readOnly
                        className="w-full bg-slate-600 border border-slate-500 rounded-lg p-3 text-white text-sm h-20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        className="bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        onClick={handleCopyShopifyKey}
                      >
                        {copied ? <CheckCircle className="w-4 h-4 inline mr-2"/> : <Copy className="w-4 h-4 inline mr-2"/>}
                        {copied ? "Copied!" : translate("Copy")}
                      </Button>
                      <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                        onClick={handleOnClick}
                      >
                        <ExternalLink className="w-4 h-4 inline mr-2" />
                        {translate("Go to Shopify App store")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Connected
                  <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">{translate("Shopify_Store_connected")}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Domain:</span>
                        <div className="text-white font-medium">{channel?.channelConfig?.domain}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <div className="text-green-400 font-medium">Connected</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Instructions */}
                <div className="mt-6 bg-slate-700 border border-slate-600 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <InfoIcon className="w-4 h-4" />
                    Setup Instructions
                  </h4>
                  
                  <div className="space-y-1">
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((stepNum) => {
                      // --- FIX START ---
                      const substeps = [];
                      let i = 0;
                      while (true) {
                        const substepKey = `Shopify_store_connect_info.steps.${stepNum}.substeps.${i}`;
                        const substepText = translate(substepKey);

                        // If translate() returns the key, the message is missing. Break the loop.
                        if (substepText === substepKey) {
                          break;
                        }

                        substeps.push(substepText);
                        i++;
                      }
                      
                      const imageKey = `Shopify_store_connect_info.steps.${stepNum}.image`;
                      const imageUrl = translate(imageKey);
                      // --- FIX END ---
                      
                      return (
                        <StepItem
                          key={stepNum}
                          step={stepNum}
                          stepData={{
                            title: translate(`Shopify_store_connect_info.steps.${stepNum}.title`),
                            substeps: substeps,
                            // Pass the image URL only if a valid translation for it exists
                            image: imageUrl !== imageKey ? imageUrl : null,
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-4 p-3 bg-slate-600 rounded-lg text-sm text-slate-300">
                    <p className="mb-2">{translate("Shopify_Key_Desc")}</p>
                    <p>{translate("Shopify_Connect")}</p>
                  </div>
                </div>
                


              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}