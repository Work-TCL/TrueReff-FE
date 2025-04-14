import { cn } from "@sohanemon/utils";
import { ChevronRight } from "lucide-react";
import React from "react";

interface IProfileCompletionCard {
  progress?: number;
  className?: string;
}

const ProfileCompletionCard = ({
  progress = 80,
  className,
}: IProfileCompletionCard) => {
  return (
    <div
      className={cn(
        "flex gap-6 justify-between p-6 w-full box-border h-fit rounded-[20px] bg-custom-gradient",
        className
      )}
    >
      <div className="flex md:gap-6 flex-col md:flex-row">
        <div className="relative w-20 md:w-28 md:h-28 h-20">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="10"
              fill="transparent"
              stroke="#E5E7EB"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="10"
              fill="transparent"
              stroke="url(#gradient)"
              strokeDasharray={251}
              strokeDashoffset={251 - (progress / 100) * 251}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9B5FE9" />
                <stop offset="50%" stopColor="#6684F0" />
                <stop offset="75%" stopColor="#DE598E" />
                <stop offset="100%" stopColor="#FBB11E" />
              </linearGradient>
            </defs>
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center font-bold md:text-2xl text-lg
 text-gray-900"
          >
            {progress}%
          </span>
        </div>
        <div className="flex-1">
          <h3 className="md:text-[32px] text-lg font-semibold text-gray-black pb-1">
            Complete your profile
          </h3>
          <p className="md:text-xl text-sm text-gray-black max-w-[80%]">
            Complete your profile to unlock earnings, brand deals, and full
            platform access.
          </p>
        </div>
      </div>

      <div className="size-16">
        <ChevronRight className="size-full shrink-0 text-3xl" />
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
