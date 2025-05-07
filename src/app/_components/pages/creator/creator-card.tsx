"use client";
import { ICreator } from "./list";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { translate } from "@/lib/utils/translate";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";

const CreatorCard = ({
  item: creator,
  handleCollaborateNow,
}: {
  item: ICreator;
  handleCollaborateNow: (creatorId: string) => void;
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router?.push(`/creator/profile/${creator?._id}`)}
      className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke hover:shadow-lg cursor-pointer"
    >
      <CardContent className="w-full p-0 flex flex-col items-center gap-3">
        <div className="bg-background rounded-lg max-w-full aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
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
        <div className="flex flex-col gap-2 text-start w-full overflow-hidden">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-xs sm:text-sm md:text-lg font-semibold w-full line-clamp-none truncate"
            text={creator.title}
          />
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-700 text-sm mt-1 w-full line-clamp-none truncate"
            text={`${
              creator.short_description ? creator.short_description : "-"
            }`}
          />

          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-500 text-[10px] sm:text-sm  mt-1 w-full line-clamp-none truncate"
            text={`${translate("Categories")} : ${
              creator.categories || "Uncategorized"
            }`}
          />

          {creator.tags?.length > 0 ? (
            <div className="flex gap-2 mt-1">
              {creator.tags.slice(0, 2).map((tag, index) => (
                <TruncateWithToolTip
                  checkHorizontalOverflow={true}
                  className="md:text-xs text-[10px] md:px-3 text-center px-1 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-300 w-fit line-clamp-none truncate"
                  text={`#${tag}`}
                />
              ))}
            </div>
          ) : (
            "-"
          )}
        </div>

        {/* Stats */}
        {/* <div className="flex justify-around text-center w-full border-t pt-3 text-sm mb-3">
        <div>
          <div className="font-semibold">{creator?.pastSales || "-"}</div>
          <div className="text-gray-500 flex items-center">Total Sale</div>
        </div>
        <div>
          <div className="font-semibold">{creator?.instagramViews || "-"}</div>
          <div className="text-gray-500 flex items-center gap-2">
            <FaInstagram size={20} /> Views
          </div>
        </div>
        <div>
          <div className="font-semibold">{creator?.youtubeViews || "-"}</div>
          <div className="text-gray-500 flex items-center gap-2">
            <FaYoutube size={20} /> Views
          </div>
        </div>
      </div> */}

        {/* Button */}
        {/* <button
          onClick={() => handleCollaborateNow(creator._id)}
          className="whitespace-nowrap  border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm w-full"
        >
          {translate("Collaborate_Now")}
        </button> */}
        <button
          onClick={() => handleCollaborateNow(creator._id)}
          className="flex items-center justify-center w-full gap-2 md:px-3 px-1 py-2 md:text-sm text-[10px] border rounded-xl border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] transition-all sm:text-base sm:gap-3"
        >
          {translate("Collaborate_Now")}
        </button>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
