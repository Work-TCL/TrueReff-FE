"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Link2 } from "lucide-react";
import Image from "next/image";

export const ProileDetailUser = ({ profileDetail }: { profileDetail: any }) => {
  return (
    <Card className="w-full bg-white rounded-2xl p-4">
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex flex-col gap-2 ">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden">
              <AvatarImage
                src={profileDetail?.productImage || "/default-avatar.png"}
                className="object-cover w-full h-full"
                alt="User Avatar"
              />
            </Avatar>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-secondary text-sm md:text-base font-medium">
                  {profileDetail?.name || "Jhon Deo"}
                </p>
                <span className="text-muted-foreground text-sm">
                  ({profileDetail?.handle || "john_doe_90"})
                </span>
                <Link2 className="text-pink-500 w-4 h-4" />
              </div>
              <p className="text-font-grey text-sm">
                Helping men stay stylish with the latest fashion trends.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            I’m John, a fashion influencer sharing style tips, outfit
            inspiration, and grooming advice for men. Follow me for daily
            fashion insights!
          </p>
        </div>
        <div className="flex gap-3 mt-2 flex-wrap">
          <Image
            src="/assets/creator/profile/fbIcon.svg"
            alt="Facebook"
            width={30}
            height={30}
          />
          {/* <Image
            src="/assets/creator/profile/xIcon.svg"
            alt="X"
            width={30}
            height={30}
          /> */}
          <Image
            src="/assets/creator/Instagram-icon.svg"
            alt="Instagram"
            width={30}
            height={30}
          />
          <Image
            src="/assets/creator/Youtube-icon.svg"
            alt="YouTube"
            width={30}
            height={30}
          />
        </div>
      </CardContent>
    </Card>
  );
};
