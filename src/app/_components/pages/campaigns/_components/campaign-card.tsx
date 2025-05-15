"use client";
import { Eye, ImageOff, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ICampaignData } from "@/lib/types-api/campaign";
import { formatForDateInput } from "@/lib/utils/commonUtils";
import { campaignStatus } from "../list";
import { Card, CardContent } from "@/components/ui/card";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { useTranslations } from "next-intl";

const CampaignCard = ({ item: campaign }: { item: ICampaignData }) => {
  const translate = useTranslations();
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/vendor/campaign/${campaign?._id}?view=true`)}
      className="cursor-pointer w-full border border-stroke rounded-xl p-4 flex flex-col items-center text-center gap-3 hover:shadow-sm transition-shadow bg-white overflow-hidden"
    >
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        <div className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {campaign.imageUrls?.length > 0 ? (
            <img
              src={campaign.imageUrls[0]}
              alt={campaign.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Title + Category */}
        <div className="flex flex-col gap-2 text-start w-full overflow-hidden">
          <div className="flex items-center gap-1">
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              className="text-xs sm:text-sm md:text-lg font-semibold w-full max-w-[350px] line-clamp-none truncate"
              text={campaign.name}
            />
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/vendor/campaign/${campaign?._id}`);
              }}
              className="flex items-center gap-1 cursor-pointer text-base scale-75"
            >
              <div className="font-semibold">
                <PencilLine
                  strokeWidth={1}
                  className="cursor-pointer mx-auto text-sm"
                />
              </div>
              <div className="text-gray-500 flex items-center text-lg">
                {translate("Edit")}
              </div>
            </div>
          </div>
          {campaign.channels?.length > 0 ? (
            <div className="flex gap-2 mt-1">
              {campaign.channels.slice(0, 2).map((channel, index) => (
                <TruncateWithToolTip
                  checkHorizontalOverflow={true}
                  className="md:text-xs text-[10px] md:px-3 text-center px-1 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-300 w-fit line-clamp-none truncate"
                  text={`${channel}`}
                />
              ))}
            </div>
          ) : (
            "-"
          )}
          <div className="text-gray-500 md:text-sm text-[10px] mt-1">
            {formatForDateInput(campaign.startDate)} to{" "}
            {formatForDateInput(campaign.endDate)}
          </div>
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-700 text-sm mt-1 w-full line-clamp-none truncate"
            text={`${campaign.description ? campaign.description : "-"}`}
          />

          <span
            className={`text-sm ${
              campaign.status === "ACTIVE"
                ? "bg-[#5856D61A] text[#5856D6]"
                : campaign.status === "EXPIRED"
                ? "bg-[#0982281A] text-[#098228]"
                : "bg-[#FF95001A] text-[#FF9500]"
            } px-2 py-1 rounded-md text-center absolute top-0 right-0`}
          >
            {campaignStatus[campaign.status] || "Uncategorized"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
