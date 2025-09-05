"use client";
import Button from "@/app/_components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import { IChannel } from "@/lib/types-api/vendor";
import { cn } from "@/lib/utils/commonUtils";
import { ChevronDown, ChevronUp, Download, Link, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
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
    bgColor: "bg-gradient-to-r from-[#21759B] to-[#4A9EC9]",
  },
];

export default function WordPressChannelForm({
  loading,
  channels,
}: IChannelFormProps) {
  const translate = useTranslations();
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  const getChannel = (channelName: string) => {
    return channels?.find((ele) => ele?.channelType === channelName) ?? null;
  };

  const handleAccordionToggle = (channelName: string) => {
    setExpandedAccordion(expandedAccordion === channelName ? null : channelName);
  };

  const handleDownloadZip = () => {
    typeof window !== undefined && window.open("/truereff.zip", "_blank");
  };

  return (
    <>
      {channelsTypes.map((ele: IChannelTypes, index: number) => {
        const channel = getChannel(ele?.name);
        const isExpanded = expandedAccordion === ele?.name;

        return (
          <div key={`${ele?.name}-${index}`} className="mb-4 ml-6 relative">
            {/* Clean WordPress Icon */}
            <div className="absolute -left-6 top-0 xsmobile:h-9 xsmobile:w-9 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
              <img
                src={ele?.icon}
                alt="WordPress"
                className="w-7 h-7 object-contain"
              />
            </div>

            {/* Simple Accordion Header */}
            <div
              className={cn(
                "flex items-center justify-between p-4 xsmobile:p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200",
                ele?.bgColor
              )}
              onClick={() => handleAccordionToggle(ele?.name)}
            >
              <h3 className="font-semibold text-white pl-3 text-base">
                {translate("WordPress_Store_Connect")}
              </h3>
              
              <div className="flex items-center gap-3">
                {channel && (
                  <span className="bg-white/90 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                    {channel?.channelStatus}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            {/* Clean Accordion Content */}
            <div
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                isExpanded ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"
              )}
            >
              <div
                className={cn(
                  "p-6 xsmobile:p-4 rounded-lg shadow-sm",
                  ele?.bgColor
                )}
              >
                {!channel ? (
                  // Connection Form - Clean Layout
                  <div className="space-y-4">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-white/95 rounded-lg p-4">
                        <Input
                          label={translate("WordPress_Store_Domain")}
                          placeholder="Enter your WordPress store domain"
                          name={`wordpress_store_domain`}
                          type="text"
                          disabled={loading}
                          lableClassName="text-gray-700 font-medium mb-2 text-sm"
                          autoFocus={false}
                        />
                      </div>
                      <div className="bg-white/95 rounded-lg p-4">
                        <Input
                          label={translate("WordPress_Store_Id")}
                          placeholder="Enter your WordPress store ID"
                          name={`wordpress_store_id`}
                          type="text"
                          disabled={loading}
                          lableClassName="text-gray-700 font-medium mb-2 text-sm"
                          autoFocus={false}
                        />
                      </div>
                    </div>

                    {/* Action Buttons - Clean Style */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      <Button
                        type="submit"
                        loading={loading}
                        className="bg-white text-blue-700 hover:bg-white/90 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <Link className="w-4 h-4 inline mr-2" />
                        {translate("Connect")}
                      </Button>
                      <Button
                        type="button"
                        className="bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={handleDownloadZip}
                      >
                        <Download className="w-4 h-4  inline mr-2" />
                        {translate("Download")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Connected State - Simple
                  <div className="bg-white/95 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 " />
                      <h4 className="text-gray-800 font-semibold">
                        {translate("WordPress_Store_connected")}
                      </h4>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span><strong>{translate("Status")}:</strong></span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          {channel?.channelStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}