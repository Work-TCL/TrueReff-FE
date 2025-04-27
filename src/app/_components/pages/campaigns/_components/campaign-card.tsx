"use client";
import { Eye, ImageOff, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { translate } from "@/lib/utils/translate";
import { ICampaignData } from "@/lib/types-api/campaign";
import { formatForDateInput } from "@/lib/utils/commonUtils";
import { campaignStatus } from "../list";

const CampaignCard = ({ item: campaign }: { item: ICampaignData }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/vendor/campaign/${campaign?._id}?view=true`)}
      className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke cursor-pointer hover:shadow-lg"
    >
      {/* Image */}
      <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 flex justify-center items-center bg-background">
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
      <div className="text-left mb-3 relative flex-1">
        <div className="text-lg font-semibold flex flex-wrap items-center md:w-[65%] w-[62%] truncate text-wrap">
          {campaign.name}{" "}
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
        <div className="text-gray-500 text-sm my-2 flex gap-2 items-center flex-wrap">
          {campaign.channels?.map((v) => (
            <span className="bg-background py-1 px-2 rounded">{v}</span>
          ))}
        </div>
        <div className="text-gray-500 text-sm mt-1">
          {formatForDateInput(campaign.startDate)} to{" "}
          {formatForDateInput(campaign.endDate)}
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2 overflow-hidden text-ellipsis">
          {campaign.description}
        </div>

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
    </div>
  );
};

export default CampaignCard;
