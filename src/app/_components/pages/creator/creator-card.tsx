"use client";
import { ICreator } from "./list";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { translate } from "@/lib/utils/translate";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";

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
      className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke"
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
      <div className="text-center mb-3">
        <div className="text-lg font-semibold">
          {creator.title}{" "}
          <span className="text-gray-500 text-sm">
            ({creator.categories || "Uncategorized"})
          </span>
        </div>
        <div className="text-gray-700 text-sm mt-1 line-clamp-2 overflow-hidden text-ellipsis">
          {creator.short_description}
        </div>
        <div className="text-gray-500 text-sm mt-1">{creator.tag}</div>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center w-full border-t pt-3 text-sm mb-3">
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
      </div>

      {/* Button */}
      <button
        onClick={() => handleCollaborateNow(creator._id)}
        className="w-full py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-all"
      >
        {translate("Collaborate_Now")}
      </button>
    </div>
  );
};

export default CreatorCard;
