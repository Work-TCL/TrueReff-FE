"use client";
import { ICreator } from "./list";
import { ImageOff, IndianRupee, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import TruncateWithToolTip from "../../ui/truncatWithToolTip/TruncateWithToolTip";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import {
  currency,
  formatFloatValue,
  formatNumber,
} from "@/lib/utils/constants";

const CreatorCard = ({
  item: creator,
  handleCollaborateNow,
  size = "reguler",
}: {
  item: ICreator;
  handleCollaborateNow: (creatorId: string) => void;
  size?: "reguler" | "small";
}) => {
  const translate = useTranslations();
  const router = useRouter();
  return (
    <Card
      key={creator?.full_name}
      onClick={(e) => {
        e.stopPropagation();
        router?.push(`/vendor/creator-profile/${creator?._id}`);
      }}
      className="bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 flex-1 border border-stroke hover:shadow-lg cursor-pointer"
    >
      <CardContent className="w-full p-0 flex flex-col items-center gap-4">
        <div
          className={`bg-background rounded-lg max-w-full w-full flex items-center justify-center overflow-hidden ${
            size === "small" ? "h-[75px]" : "aspect-[4/3]"
          }`}
        >
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
        <div className="flex flex-col gap-4 text-start w-full overflow-hidden">
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-xs sm:text-sm md:text-lg font-semibold w-full line-clamp-none truncate"
            text={creator.full_name}
          />
          {/* <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-700 text-sm mt-1 w-full line-clamp-none truncate"
            text={`${
              creator.short_description ? creator.short_description : "-"
            }`}
          /> */}

          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className=" text-sm w-full line-clamp-none truncate"
            text={`${creator.categories || "-"}`}
          />

          {/* {creator.tags?.length > 0 ? (
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
          )} */}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center w-full text-center text-sm">
          {/* Total Sales */}
          <div className="flex-1 border-r px-2 flex flex-col gap-1">
            <div className="text-md flex items-center">
              <IndianRupee size={15} /> {formatNumber(creator?.totalRevenue)}
            </div>
            <div className="text-gray-500 text-xs">{translate("Revenue")}</div>
          </div>

          {/* Total Orders */}
          <div className="flex-1 border-r px-2 flex flex-col gap-1">
            <div className=" text-md">{formatNumber(creator?.totalOrders)}</div>
            <div className="text-gray-500 text-xs">{translate("Orders")}</div>
          </div>

          {/* Rating */}
          <div className="flex-1 px-2 flex flex-col gap-1">
            <div className=" text-md flex items-center justify-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span>{`${formatFloatValue(creator?.averageRating)}/5`}</span>
            </div>
            <div className="text-gray-500 text-xs">{translate("Ratings")}</div>
          </div>
        </div>

        <div className="flex justify-between text-center w-full gap-1 text-sm">
          <div className="text-gray-500 bg-gray-100 w-full px-4 py-2 rounded-3xl justify-center flex items-center gap-2">
            <img src="/assets/creator/insta-gram.svg" width={15} height={15} />{" "}
            {creator?.instagramFollowers}
          </div>

          <div className="text-gray-500 bg-gray-100 w-full px-4 py-1 rounded-3xl justify-center flex items-center gap-2">
            <img src="/assets/creator/you-tube.svg" width={18} height={18} />{" "}
            {creator?.youtubeFollowers}
          </div>
        </div>

        {/* Button */}
        {/* <button
          onClick={() => handleCollaborateNow(creator._id)}
          className="whitespace-nowrap  border border-[#FFEDF2] bg-[#FFEDF2] text-[#FF4979] rounded-md transition-all py-3 px-[10px] text-sm w-full"
        >
          {translate("Collaborate_Now")}
        </button> */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCollaborateNow(creator._id);
          }}
          className="flex items-center justify-center w-full gap-2 md:px-3 px-1 py-2 md:text-sm text-[10px] border rounded-xl border-primary hover:bg-primary text-[#FF4979] hover:text-white transition-all sm:text-base sm:gap-3"
        >
          {translate("Collaborate_Now")}
        </button>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
