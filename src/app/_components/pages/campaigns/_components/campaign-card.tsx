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
      //   onClick={() => router?.push(`/vendor/products/view/${campaign?._id}`)}
      className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke"
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
      <div className="text-center mb-3">
        <div className="text-lg font-semibold">
          {campaign.name}{" "}
          <span
            className={`text-sm ml-1 ${
              campaign.status === "ACTIVE"
                ? "bg-[#5856D61A] text[#5856D6]"
                : campaign.status === "EXPIRED"
                ? "bg-[#0982281A] text-[#098228]"
                : "bg-[#FF95001A] text-[#FF9500]"
            } px-2 py-1 rounded-md text-center`}
          >
            {campaignStatus[campaign.status] || "Uncategorized"}
          </span>
        </div>
        <div className="text-gray-500 text-sm mt-1">
          {formatForDateInput(campaign.startDate)} to{" "}
          {formatForDateInput(campaign.endDate)}
        </div>
        <div className="text-gray-500 text-sm mt-1">
          {campaign.channels?.join(", ")}
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2 overflow-hidden text-ellipsis">
          {campaign.description}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center w-full border-t pt-3 text-sm mb-3">
        <div
          onClick={() =>
            router.push(`/vendor/campaign/${campaign?._id}?view=true`)
          }
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="font-semibold">
            <Eye
              strokeWidth={1.5}
              color="#FF4979"
              className="cursor-pointer mx-auto"
            />{" "}
          </div>
          <div className="text-gray-500 flex items-center gap-2">View</div>
        </div>
        <div
          onClick={() => router.push(`/vendor/campaign/${campaign?._id}`)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="font-semibold">
            <PencilLine strokeWidth={1.5} className="cursor-pointer mx-auto" />
          </div>
          <div className="text-gray-500 flex items-center">
            {translate("Edit")}
          </div>
        </div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="font-semibold">
            <Trash2
              strokeWidth={1.5}
              color="#FF3B30"
              className="cursor-pointer mx-auto"
            />
          </div>
          <div className="text-gray-500 flex items-center">
            {translate("Delete")}
          </div>
        </div>
      </div>

      {/* Button */}
      {/* <button
        onClick={() => handleCollaborateNow(product._id)}
        className="w-full py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-all"
      >
        {translate("Collaborate_Now")}
      </button> */}
    </div>
  );
};

export default CampaignCard;
