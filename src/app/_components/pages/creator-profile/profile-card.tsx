import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, formatFollowers } from "@/lib/utils/commonUtils";

interface IProps {
  banner_image?: string;
  profile_image?: string;
  full_name?: string;
  user_name?: string;
  short_description?: string;
  long_description?: string;
  tags?: string[];
  categories?: string[];
  channels?: {
    youtubeFollowers?: number;
    instagramFollowers?: number;
    facebook_link?: string;
    twitter_link?: string;
    youtube_link?: string;
    instagram_link?: string;
  };
  store_name?: string;
  store_link?: string;
}

export default function ProfileCard({
  banner_image,
  profile_image,
  full_name,
  user_name,
  short_description,
  long_description = "",
  tags = [],
  categories = [],
  channels,
  store_name,
  store_link,
}: IProps) {
  const router = useRouter();
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
                alt={full_name}
                width={120}
                height={120}
              />
            ) : (
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8LhuoUUgh-Ji96FR66bY_axXP-aSc7tf_kGiHSLkzpoTCPVSbjg&s=10&ec=72940544"
                alt={full_name}
                width={140}
                height={140}
                className="opacity-50"
              />
            )}
            {profile_image ? (
              <AvatarFallback>{full_name}</AvatarFallback>
            ) : null}
          </Avatar>
        </div>
        <div className="flex gap-2 md:gap-4 text-gray-500 text-lg md:text-2xl">
          {channels?.facebook_link && (
            <Link
              href={channels?.facebook_link}
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
          {channels?.twitter_link && (
            <Link
              href={channels?.twitter_link}
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
          {channels?.instagram_link &&
          channels?.instagramFollowers &&
          channels?.instagramFollowers > 0 ? (
            <Link
              href={channels?.instagram_link}
              target="_blank"
              className="flex items-center justify-center p-1.5"
            >
              <div className="text-gray-500 bg-gray-100 w-full px-4 py-2 rounded-3xl justify-center flex items-center gap-2 text-sm">
                <img
                  src="/assets/creator/insta-gram.svg"
                  width={15}
                  height={15}
                />{" "}
                {formatFollowers(channels?.instagramFollowers || 0)}
              </div>
            </Link>
          ) : null}
          {channels?.youtube_link &&
          channels?.youtubeFollowers &&
          channels?.youtubeFollowers > 0 ? (
            <Link
              href={channels?.youtube_link}
              target="_blank"
              className="flex items-center justify-center p-1.5"
            >
              <div className="text-gray-500 bg-gray-100 w-full px-4 py-1 rounded-3xl justify-center flex items-center gap-2 text-sm">
                <Image
                  src="/assets/creator/profile/ytIcon.svg"
                  alt={"youtubeIcon"}
                  width={35}
                  height={35}
                />
                {formatFollowers(channels?.youtubeFollowers || 0)}
              </div>
            </Link>
          ) : null}
        </div>
      </div>
      <CardContent className="pt-2 md:pt-2 pb-4 md:pb-6 px-2 md:px-4 flex flex-col gap-2 md:gap-3">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <h2 className="text-lg md:text-xl font-medium text-gray-black">
            {full_name}
          </h2>
          <span className="text-lg md:text-xl font-medium text-gray-black">
            {user_name ? `(@${store_name})` : ""}
          </span>
          <LinkIcon
            onClick={() =>
              router.push(
                store_link
                  ? store_link
                  : `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${store_name}`
              )
            }
            className="text-primary cursor-pointer w-4 h-4 md:w-5 md:h-5"
          />
        </div>
        <p className="text-sm md:text-base text-font-grey">
          {short_description}
        </p>
        {/* <div className="flex gap-2 md:gap-4 flex-wrap">
                    {tags.map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="bg-gray-darken text-white py-1 px-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-darken/80 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div> */}
        <div className="text-sm md:text-base text-font-grey">
          {long_description}
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4">
          {categories?.map((v) => (
            <div
              key={v}
              className={cn(
                "flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground border border-muted-foreground"
              )}
            >
              {v}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
