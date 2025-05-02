"use client";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { translate } from "@/lib/utils/translate";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
export interface ICategory {
  _id: string;
  name: string;
}

export interface IChannel {
  _id: string;
  creatorId: string;
  channelId: string;
  channelName: string;
  handleName: string;
  token: string;
  channelType: string;
  createdAt: string;
  updatedAt: string;
  lastFiveVideoViews: number;
  lastMonthViews: number;
}
export interface ICreator {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  sub_category: string[];
  category: ICategory[];
  channels: IChannel[];
  categories?: string;
  tag?: string;
  instagramViews?: string;
  youtubeViews?: string;
  pastSales?: string;
}
const CreatorCard = ({
  item: creator,
  handleCollaborateNow,
}: {
  item: ICreator;
  handleCollaborateNow: (creatorId: string) => void;
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router?.push(`/creator/profile/${creator?._id}`)}
      className="bg-white cursor-pointer rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke hover:shadow-lg"
    >
      {/* Image */}
      <div className="w-full aspect-[3/2] rounded-lg overflow-hidden mb-3 flex justify-center items-center bg-background">
        {creator.profile_image ? (
          <img
            src={creator.profile_image}
            alt={creator.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="w-8 h-8 text-gray-400" />
        )}
      </div>

      {/* Title + Category */}
      <div className="text-center sm:mb-3 mb-2">
        <div className="text-lg font-semibold">
          <TruncateWithToolTip
            className="line-clamp-none truncate text-xs sm:text-lg"
            checkHorizontalOverflow={true}
            text={creator.title}
          />
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2 overflow-hidden text-ellipsis">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="line-clamp-none truncate text-xs sm:text-sm"
            text={creator.short_description}
          />
        </div>
        <div className="text-gray-500 text-sm mt-1">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="line-clamp-none truncate text-xs sm:text-sm"
            text={`${translate("Categories")} : ${
              creator.categories || "Uncategorized"
            }`}
          />
        </div>
        -
        {creator.tags?.length > 0 && (
          <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
            {creator.tags?.slice(0, 4).map((v) => (
              <TruncateWithToolTip
                checkHorizontalOverflow={true}
                className="line-clamp-none truncate bg-background py-1 px-2 rounded text-xs sm:text-sm"
                text={`#${v}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex sm:flex-row flex-col justify-around text-center w-full border-t sm:pt-3 pt-2 text-xs sm:text-sm mb-3 gap-1">
        <div className="sm:block flex gap-2 items-center">
          <div className="font-semibold sm:block hidden">
            {creator?.pastSales || "-"}
          </div>
          <div className="text-gray-500 flex items-center">Total Sale</div>
          <div className="font-semibold sm:hidden block ">
            {creator?.pastSales || "-"}
          </div>
        </div>
        <div className="sm:block flex gap-2 items-center">
          <div className="font-semibold sm:block hidden">
            {creator?.instagramViews || "-"}
          </div>
          <div className="text-gray-500 flex items-center gap-2">
            <FaInstagram size={20} /> Views
          </div>
          <div className="font-semibold sm:hidden block">
            {creator?.instagramViews || "-"}
          </div>
        </div>
        <div className="sm:block flex gap-2 items-center">
          <div className="font-semibold sm:block hidden">
            {creator?.youtubeViews || "-"}
          </div>
          <div className="text-gray-500 flex items-center gap-2">
            <FaYoutube size={20} /> Views
            <div className="font-semibold sm:hidden block">
              {creator?.youtubeViews || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => handleCollaborateNow(creator._id)}
        className="whitespace-nowrap  border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all sm:py-3 py-2 sm:px-[10px] px-1 text-xs sm:text-sm w-full"
      >
        {translate("Collaborate_Now")}
      </button>
    </div>
  );
};

export default CreatorCard;
