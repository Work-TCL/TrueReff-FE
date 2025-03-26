"use client";
import React, { useEffect, useState } from "react";
import { SlidingTabBar } from "../../components-common/tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import {
  creatorOnBoardingSchema,
  creatorSocialConnectSchema,
  ICreatorOnBoardingSchema,
  ICreatorSocialConnectSchema,
} from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/app/_components/ui/button";
import BasicInfoForm from "./components/basic-details";
import SocialMedia from "./components/social-media";
import ProfileSetup from "./components/profile-setup";
import toast from "react-hot-toast";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import { useRouter, useSearchParams } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import PaymentDetails from "./components/payment-details";
import {
  IPostCreatorRegisterRequest,
  IPostCreatorRegisterResponse,
} from "@/lib/types-api/auth";
import { creatorRegister } from "@/lib/web-api/auth";
import axiosInstance from "@/lib/web-api/http-common";

let allTabs: {
  id: string;
  name: string;
  Icon: any;
}[] = [
  {
    id: "1",
    name: "Basic Details",
    Icon: HiOutlineSquare3Stack3D,
  },
  {
    id: "2",
    name: "Profile Setup",
    Icon: GrDocumentText,
  },
  {
    id: "3",
    name: "Social Media",
    Icon: FaRegUserCircle,
  },
  {
    id: "4",
    name: "Payment Detail",
    Icon: FaRegUserCircle,
  },
];

const TABS_STATUS = {
  BASIC_DETAILS: 0,
  PROFILE_SETUP: 1,
  SOCIAL_MEDIA: 2,
  PAYMENT_DETAILS: 3,
};
interface IProps {
  creatorDetails: any;
}
export default function CreatorRegistrationPage({ creatorDetails }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";
  const tab = searchParams.get("tab") ?? "0";
  const activeTab = parseInt(tab);
  const [youtubeConnected, setYoutubeConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const methods = useForm<ICreatorOnBoardingSchema>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: email,
      phone_number: "",
      profile_title: "",
      short_description: "",
      long_description: "",
      tags: [],
      category: [],
      sub_category: [],
      profile_image: null,
      banner_image: null,
    },
    resolver: yupResolver(creatorOnBoardingSchema),
    mode: "onSubmit",
  });

  const methodsSocial = useForm<ICreatorSocialConnectSchema>({
    defaultValues: {
      channels: [
        {
          account_name: "",
          handle_name: "",
          account_link: "",
        },
        {
          account_name: "",
          handle_name: "",
          account_link: "",
        },
      ],
    },
    resolver: yupResolver(creatorSocialConnectSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ICreatorOnBoardingSchema) => {
    setLoading(true);

    try {
      const payload: IPostCreatorRegisterRequest = {
        full_name: data.full_name,
        // email: data.email,
        phone: data.phone_number,
        user_name: data.user_name,
        title: data.profile_title,
        long_description: data.long_description,
        short_description: data.short_description,
        category: data.category.map((v) => v.value),
        sub_category: data.sub_category.map((v) => v.value),
        tags: data.tags || [],
      };

      if (data.banner_image) {
        payload.banner_image = data.banner_image;
      }
      if (data.profile_image) {
        payload.profile_image = data.profile_image;
      }

      const response: IPostCreatorRegisterResponse = await creatorRegister(
        payload
      );
      console.log("response",response)
      if (response?.status === 201) {
        // toast.success("Creator successfully registered.");
        router.push(`?tab=2&creatorId=${response?.data?._id}`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSocial = async (data: ICreatorSocialConnectSchema) => {
    setLoading(true);
    try {
      // const payload: IPostCreatorRegisterRequest = {
      //   channels: data.channels,
      // };
      // const response: IPostCreatorRegisterResponse = await creatorRegister(
      //   payload
      // );
      // if (response?.status === 201) {
      //   // toast.success("Creator successfully registered.");
      //   // router.push("/dashboard");
      //   setActiveTab(TABS_STATUS.SOCIAL_MEDIA);
      // }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerStepper = async () => {
    setLoading(true);
    if (TABS_STATUS.BASIC_DETAILS === activeTab) {
      const basicInfoField: any = [
        "full_name",
        "user_name",
        "email",
        "phone_number",
      ];
      const isValid = await methods.trigger(basicInfoField);

      if (isValid) {
        router.push(`?tab=1&email=${email}`); // Move to next tab
      }
    } else if (TABS_STATUS.PROFILE_SETUP === activeTab) {
      const profileSetUpFields: any = [
        "title",
        "long_description",
        "short_description",
        "category",
        "sub_category",
        "tags",
      ];
      const isValid = await methods.trigger(profileSetUpFields);

      if (isValid) {
        router.push(`?tab=2`); // Move to next tab
      }
    } else if (TABS_STATUS.SOCIAL_MEDIA === activeTab) {
      if (youtubeConnected) {
        router.push("/creator/dashboard");
      } else {
        toast.error("at least one channel connect required.");
      }
    }
    setLoading(false);
  };
  const handleDisableConnect = async () => {
    const channels: any = ["channels[1].handle_name"];
    return await methods.trigger(channels);
  };

  useEffect(() => {
    const code = searchParams.get("code"); // ✅ Correct way to get query parameters
    if (code) {
      router.push(`?tab=2`);
    }
  }, [searchParams]);

  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 md:pt-10 pt-5 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />
      <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
        <div className="flex justify-center md:text-[38px] text-2xl md:py-0 py-5 px-4 font-semibold">
          {
            {
              [TABS_STATUS.BASIC_DETAILS]: "Creator Registration",
              [TABS_STATUS.PROFILE_SETUP]: "Complete Your Profile",
              [TABS_STATUS.SOCIAL_MEDIA]: "Connect Your Social Accounts",
              [TABS_STATUS.PAYMENT_DETAILS]: "Set Up Your Payment Info",
            }[activeTab]
          }
        </div>
        <SlidingTabBar
          tabs={allTabs}
          setActiveTabIndex={(v) => {
            if (
              [TABS_STATUS.SOCIAL_MEDIA, TABS_STATUS].includes(activeTab) &&
              [TABS_STATUS.SOCIAL_MEDIA, TABS_STATUS].includes(v)
            ) {
              router.push(`?tab=${v}`);
            }

            if (
              [TABS_STATUS.BASIC_DETAILS, TABS_STATUS.PROFILE_SETUP].includes(
                activeTab
              ) &&
              [TABS_STATUS.BASIC_DETAILS, TABS_STATUS.PROFILE_SETUP].includes(v)
            ) {
              router.push(`?tab=${v}`);
            }
          }}
          activeTabIndex={activeTab}
          grid={4}
        />
        {[TABS_STATUS.BASIC_DETAILS, TABS_STATUS.PROFILE_SETUP].includes(
          activeTab
        ) && (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col gap-3 relative"
            >
              {
                {
                  [TABS_STATUS.BASIC_DETAILS]: <BasicInfoForm />,
                  [TABS_STATUS.PROFILE_SETUP]: <ProfileSetup />,
                }[activeTab]
              }
              <div className="flex bg-white">
                <Button
                  type="submit"
                  className={cn(
                    "w-fit font-medium px-8",
                    activeTab === TABS_STATUS.PROFILE_SETUP ? "block" : "hidden"
                  )}
                  size="small"
                  loading={loading}
                  disabled={loading}
                >
                  {"Save & Continue"}
                </Button>
                <Button
                  className={cn(
                    "w-fit font-medium px-8",
                    activeTab === TABS_STATUS.PROFILE_SETUP ? "hidden" : "block"
                  )}
                  size="small"
                  onClick={handleTriggerStepper}
                  loading={loading}
                  disabled={loading}
                >
                  {"Save & Continue"}
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
        {[TABS_STATUS.SOCIAL_MEDIA, TABS_STATUS.PAYMENT_DETAILS].includes(
          activeTab
        ) && (
          <FormProvider {...methodsSocial}>
            <form
              onSubmit={methodsSocial.handleSubmit(onSubmitSocial)}
              className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col gap-3 relative"
            >
              {
                {
                  [TABS_STATUS.SOCIAL_MEDIA]: (
                    <SocialMedia
                      code={searchParams.get("code") || ""}
                      setYoutubeConnected={setYoutubeConnected}
                      youtubeConnected={youtubeConnected}
                    />
                  ),
                  [TABS_STATUS.PAYMENT_DETAILS]: <PaymentDetails />,
                }[activeTab]
              }
              <div className="flex bg-white">
                <Button
                  type="button"
                  className="w-fit bg-white text-black font-medium px-8"
                  size="small"
                  onClick={() => {
                    activeTab < 3 && router.push(`?tab=${activeTab + 1}`);;
                    if (activeTab === TABS_STATUS.PAYMENT_DETAILS) {
                      router.push("/creator/dashboard");
                    }
                  }}
                >
                  {"Skip"}
                </Button>

                <Button
                  className={cn("w-fit font-medium px-8", "block")}
                  size="small"
                  onClick={handleTriggerStepper}
                  loading={loading}
                  disabled={loading}
                >
                  {"Save & Continue"}
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}
