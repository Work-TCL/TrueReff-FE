import { ChevronRight } from "lucide-react";
import React, { useState } from "react";

const ProfileCompletionCard = () => {
  const [progress, setProgress] = useState(80);

  return (
    <div className="flex items-center gap-6 justify-between p-6 w-full box-border h-fit rounded-[20px] shadow-lg bg-gradient-to-r from-[#E2D7FC] via-[#FCE1E4] to-[#FFE7C2]">
      <div className="flex items-center md:gap-6 flex-col md:flex-row">
        <div className="relative w-20 h-20">
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
          <span className="absolute inset-0 flex items-center justify-center font-bold text-lg text-gray-900">
            {progress}%
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Complete your profile
          </h3>
          <p className="text-sm text-gray-700">
            Complete your profile to unlock earnings, brand deals, and full
            platform access.
          </p>
        </div>
      </div>

      <div className="size-12">
        <ChevronRight className="size-full shrink-0" />
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
