import { translate } from "@/lib/utils/translate";
import { cn } from "@sohanemon/utils";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface IProfileCompletionCard {
  progress?: number;
  className?: string;
  gradientId?: string
}

const ProfileCompletionCard = ({
  progress = 0,
  className,
  gradientId = "gradient"
}: IProfileCompletionCard) => {
  const router = useRouter()
  const getCompleteProfileMessage = () => {
    if (progress < 25) return translate("Complete_your_profile");
    else if (progress >= 25 && progress < 55)
      return translate("Complete_your_Social_Media_Connects");
    else return translate("Complete_your_Payment_Integration");
  };

  const getCompleteProfileDescription = () => {
    if (progress < 25)
      return translate("Complete_your_profile_Description");
    else if (progress >= 25 && progress < 55)
      return translate("Connect_your_Youtube_Channel_or_Instagram_account");
    else return translate("Complete_your_Subscription_plan");
  };
  
  const handleCompleteProfile = () => {
    router.push('/creator/settings')
  }
  return (
    <div
      className={cn(
        "flex flex-col relative md:flex-row items-center justify-between text-left md:text-left p-5 md:p-6 rounded-2xl w-full bg-custom-gradient gap-4",
        className
      )}
    >
      <div className="absolute top-4 right-4 md:hidden cursor-pointer" onClick={handleCompleteProfile}>
        <ChevronRight className="w-5 h-5 text-gray-800" />
      </div>
      {/* Progress circle */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 mx-auto md:mx-0">
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
              stroke={`url(#${gradientId})`}
              strokeDasharray={251}
              strokeDashoffset={251 - (progress / 100) * 251}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#9B5FE9" />
              <stop offset="50%" stopColor="#6684F0" />
              <stop offset="75%" stopColor="#DE598E" />
              <stop offset="100%" stopColor="#FBB11E" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-sm md:text-xl text-gray-900">
          {progress}%
        </span>
      </div>

      {/* Text Section */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="font-semibold text-base md:text-lg text-gray-black">
          {getCompleteProfileMessage()}
        </span>
        <p className="text-sm md:text-base text-gray-black">
          {getCompleteProfileDescription()}
        </p>
      </div>

      {/* Chevron Icon on desktop only */}
      <div className="hidden md:flex items-center justify-center w-10 h-10 cursor-pointer"  onClick={handleCompleteProfile}>
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
