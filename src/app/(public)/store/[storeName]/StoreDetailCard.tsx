import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Facebook,
  Instagram,
  Youtube,
  Link as LinkIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ICreateStoreRequest } from "@/lib/types-api/my-store";

interface IProps {
  store: ICreateStoreRequest;
}

export default function StoreDetailCard({
  store: {
    creatorId,
    name,
    description,
    tags,
    category,
    link,
    profile_image,
    banner_image,
  },
}: IProps) {
  return (
    <Card className="bg-white rounded-[20PX] overflow-hidden border-0 shadow-none">
      <div className="relative h-40 md:h-48 w-full bg-blue-100 rounded-b-[20px]">
        {banner_image ? (
          <img
            src={banner_image}
            alt="Background"
            className="w-full h-full object-cover rounded-b-[20px]"
          />
        ) : (
          <img
            src="/assets/creator/profile/profile-bg.png"
            alt="Background"
            className="w-full h-full object-cover rounded-b-[20px]"
          />
        )}
      </div>
      <div className="flex items-end px-6 -mt-14 w-full justify-between">
        <div className="w-[120px] h-[120px] md:w-[120px] md:h-[120px]">
          <Avatar className="w-[120px] h-[120px] md:w-[120px] md:h-[120px] border-1 border-white bg-white">
            {profile_image ? (
              <AvatarImage
                src={profile_image}
                alt={name}
                width={120}
                height={120}
              />
            ) : (
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8LhuoUUgh-Ji96FR66bY_axXP-aSc7tf_kGiHSLkzpoTCPVSbjg&s=10&ec=72940544"
                alt={name}
                width={140}
                height={140}
                className="opacity-50"
              />
            )}
            {profile_image ? <AvatarFallback>{name}</AvatarFallback> : null}
          </Avatar>
        </div>
        <div className="flex gap-2 md:gap-4 text-gray-500 text-lg md:text-2xl">
          <Link
            href="#"
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
          <Link
            href="#"
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
          <Link
            href="#"
            target="_blank"
            className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
          >
            <Image
              src="/assets/creator/profile/instaIcon.svg"
              alt={"instaIcon"}
              width={35}
              height={35}
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            className="w-[35px] h-[35px] rounded-full bg-background flex items-center justify-center p-1.5"
          >
            <Image
              src="/assets/creator/profile/ytIcon.svg"
              alt={"youtubeIcon"}
              width={35}
              height={35}
            />
          </Link>
        </div>
      </div>
      <CardContent className="pt-2 md:pt-2 pb-4 md:pb-6 px-4 md:px-6 flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <h2 className="text-lg md:text-xl font-medium text-gray-black">
            {name}
          </h2>
          <LinkIcon className="text-primary cursor-pointer w-4 h-4 md:w-5 md:h-5" />
        </div>
        <p className="text-sm md:text-base text-font-grey">{description}</p>
        <div className="flex gap-2 md:gap-4 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-small-light text-sm md:text-sm px-3 py-3 text-gray-black rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2 md:gap-4">
          {category?.map((v) => (
            <Button
              key={v}
              size={"lg"}
              className="bg-primary-color hover:bg-pink-600 text-white px-4 md:px-5 py-1 md:py-3 rounded-md text-xs md:text-sm"
            >
              {v}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
