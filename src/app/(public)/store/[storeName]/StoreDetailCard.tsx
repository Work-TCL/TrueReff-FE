import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IStore } from "./main";
import { toastMessage } from "@/lib/utils/toast-message";
import ToolTip from "@/app/_components/components-common/tool-tip";
import { formatNumber } from "@/lib/utils/constants";

interface IProps {
  store: IStore;
  isCreator?: boolean;
}

export default function StoreDetailCard({ store, isCreator }: IProps) {
  const handleCopyLink = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${store?.store_name}`;
        await navigator.clipboard.writeText(url);
        toastMessage.success("Link copied to clipboard!");
      } catch (err) {
        toastMessage.error("Failed to copy!");
      }
    };
  return (
    <Card className="bg-white rounded-[20PX] overflow-hidden border-0 shadow-none h-full">
      {/* Banner Image */}
      <div className="relative h-28 md:h-48 w-full bg-blue-100 rounded-b-[20px]">
        {store?.banner_image ? (
          <img
            src={store?.banner_image}
            alt="Background"
            className="w-full h-full object-cover rounded-b-[20px]"
          />
        ) : (
          <img
            src="/assets/banner-image.png"
            alt="Background"
            className="w-full h-full object-cover rounded-b-[20px]"
          />
        )}

        {/* Social Media Links */}
        <div className="absolute bottom-[-90px] md:bottom-[-50px] right-4 flex  gap-2 md:gap-4 ">
          {store?.facebook_link && (
            <Link
              href={store?.facebook_link}
              target="_blank"
              className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
            >
              <Image
                src="/assets/creator/profile/fbIcon.svg"
                alt={"facebook"}
                width={35}
                height={35}
              />
            </Link>
          )}
          {store?.twitter_link && (
            <Link
              href={store?.twitter_link}
              target="_blank"
              className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
            >
              <Image
                src="/assets/creator/profile/twitterIcon.svg"
                alt={"twitterIcon"}
                width={35}
                height={35}
              />
            </Link>
          )}
          {store?.instagram_link && (
            <Link
              href={store?.instagram_link}
              className="text-gray-500 bg-gray-100 w-full px-2 md:px-4 py-1 md:py-2 rounded-3xl justify-center flex items-center gap-2"
            >
              <img
                src="/assets/creator/insta-gram.svg"
                width={15}
                height={15}
              />{" "}
              {
                formatNumber(
                  store?.channels?.find((v) => v.channelType === "instagram")
                    ?.followers
                )
              }
            </Link>
          )}
          {store?.youtube_link && (
            <Link
              href={store?.youtube_link}
              className="text-gray-500 bg-gray-100 w-full px-3 md:px-4 py-1 md:py-2 rounded-3xl justify-center flex items-center gap-2"
            >
              <img src="/assets/creator/you-tube.svg" width={18} height={18} />{" "}
              {
                formatNumber(
                  store?.channels?.find((v) => v.channelType === "youtube")
                    ?.followers
                )
              }
            </Link>
          )}
        </div>
      </div>

      {/* Avatar Section */}
      <div className="relative w-full -mt-14">
        <div className="absolute md:left-24 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-[120px] md:h-[120px]">
          <Avatar className="w-24 h-24 md:w-[120px] md:h-[120px] border-1 border-white bg-white">
            {store?.profile_image ? (
              <AvatarImage
                key={store?.profile_image}
                src={store?.profile_image}
                alt={"Store Profile"}
                className="object-cover"
                width={120}
                height={120}
              />
            ) : (
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8LhuoUUgh-Ji96FR66bY_axXP-aSc7tf_kGiHSLkzpoTCPVSbjg&s=10&ec=72940544"
                alt={"Store Profile"}
                width={140}
                height={140}
                className="opacity-50"
              />
            )}
            {store?.profile_image ? (
              <AvatarFallback>{store?.store_name}</AvatarFallback>
            ) : null}
          </Avatar>
        </div>
      </div>

      {/* Store Details */}
      <CardContent className="mt-36 md:mt-32 pt-2 md:pt-2 pb-4 md:pb-6 px-3 md:px-4 flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <h2 className="flex items-center text-base md:text-xl font-medium text-gray-black">
            {store?.store_name}
            {store?.full_name ? ` (${store?.full_name})` : ""} {isCreator && <ToolTip content={"Copy Store Link"} delayDuration={1000}><LinkIcon className="ml-1 text-primary-color cursor-pointer" onClick={() => handleCopyLink()} /></ToolTip>}
          </h2>
        </div>
        <div className="text-xs md:text-sm">{store?.store_description}</div>
      </CardContent>
    </Card>
  );
}
