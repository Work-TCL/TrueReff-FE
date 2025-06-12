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
  isCategoryShow = true,
  isBoxShadow = true,
}: {
  item: ICreator;
  handleCollaborateNow: (creatorId: string) => void;
  isCategoryShow?: boolean;
  isBoxShadow?: boolean;
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
      className={`bg-white rounded-xl overflow-hidden flex flex-col justify-between h-full p-4 xsmobile:p-2 flex-1 border border-stroke ${
        isBoxShadow ? "hover:shadow-lg" : ""
      } cursor-pointer`}
    >
      <CardContent className="w-full p-0 flex flex-col items-center gap-3 xsmobile:gap-2">
        <div
          className={`bg-background max-w-full flex items-center justify-center overflow-hidden h-[120px] w-[120px] rounded-full`}
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
        <div className={`flex flex-col w-full overflow-hidden text-center`}>
          <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="xsmobile:text-[9px] text-xs sm:text-sm md:text-lg font-semibold w-full line-clamp-none truncate"
            text={creator.full_name}
          />
          {/* <TruncateWithToolTip
            checkHorizontalOverflow={true}
            className="text-gray-700 text-sm mt-1 w-full line-clamp-none truncate"
            text={`${
              creator.short_description ? creator.short_description : "-"
            }`}
          /> */}
          {isCategoryShow && (
            <TruncateWithToolTip
              checkHorizontalOverflow={true}
              className="xsmobile:text-[9px] text-sm w-full line-clamp-none truncate text-gray-500"
              text={`${creator.categories || "-"}`}
            />
          )}
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
          <div className="flex-1 border-r px-2 xsmobile:px-1 flex flex-col gap-1 xsmobile:gap-0">
            <div className="xsmobile:text-[9px] text-md flex items-center justify-center">
              <IndianRupee size={15} className="xsmobile:w-2" />{" "}
              {formatNumber(creator?.totalRevenue)}
            </div>
            <div className="xsmobile:text-[9px] text-gray-500 text-xs">
              {translate("Revenue")}
            </div>
          </div>

          {/* Total Orders */}
          <div className="flex-1 border-r px-2 xsmobile:px-1 flex flex-col gap-1 xsmobile:gap-0">
            <div className="xsmobile:text-[9px] text-md">
              {formatNumber(creator?.totalOrders)}
            </div>
            <div className="xsmobile:text-[9px] text-gray-500 text-xs">
              {translate("Orders")}
            </div>
          </div>

          {/* Rating */}
          <div className="flex-1 px-2 xsmobile:px-1 flex flex-col gap-1">
            <div className="xsmobile:text-[9px] text-md flex items-center justify-center gap-1 xsmobile:gap-0">
              <Star
                size={16}
                className="text-yellow-500 fill-yellow-500 xsmobile:w-2"
              />
              <span>{`${formatFloatValue(creator?.averageRating)}/5`}</span>
            </div>
            <div className="xsmobile:text-[9px] text-gray-500 text-xs">
              {translate("Ratings")}
            </div>
          </div>
        </div>

        <div className="flex justify-between text-center w-full gap-1 text-sm">
          <div className="xsmobile:text-[9px] text-gray-500 bg-gray-100 w-full px-4 py-1 xsmobile:px-2 rounded-3xl justify-center flex items-center gap-2 xsmobile:h-fit">
            <img
              src="/assets/creator/insta-gram.svg"
              width={15}
              height={15}
              className="xsmobile:w-3"
            />{" "}
            {creator?.instagramFollowers}
          </div>

          <div className="xsmobile:text-[9px] text-gray-500 bg-gray-100 w-full px-4 py-1 xsmobile:px-2 rounded-3xl justify-center flex items-center gap-2 xsmobile:h-fit">
            <img
              src="/assets/creator/you-tube.svg"
              width={18}
              height={18}
              className="xsmobile:w-3"
            />{" "}
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
