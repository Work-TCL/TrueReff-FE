"use client";
import React, { useState } from "react";
import { SlidingTabBar } from "../../components-common/tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import {
  creatorOnBoardingSchema,
  ICreatorOnBoardingSchema,
} from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/app/_components/ui/button";
import BasicInfoForm from "./components/basic-details";
import SocialMedia from "./components/social-media";
import ProfileSetup from "./components/profile-setup";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import PaymentDetails from "./components/payment-details";

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
  profile: any;
}
export default function CreatorRegistrationPage({ profile }: IProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();
  const [activeTab, setActiveTab] = useState<number>(TABS_STATUS.BASIC_DETAILS);
  const methods = useForm<ICreatorOnBoardingSchema>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: profile.email,
      phone: "",
      title: "",
      short_description: "",
      long_description: "",
      tags: [],
      category: "",
      sub_category: "",
      profile_image: null,
      banner_image: null,
    },
    resolver: yupResolver(creatorOnBoardingSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ICreatorOnBoardingSchema) => {
    setLoading(true);
    console.log("data", data);

    try {
      // const payload: IPostVendorRegisterRequest = {
      //   business_name: data.business_name,
      //   company_email: data.company_email,
      //   company_phone: data.company_phone,
      //   contacts: Array.isArray(data.contacts) ? data.contacts : [],
      //   gst_number: data.gst_number,
      //   omni_channels: Array.isArray(data.omni_channels)
      //     ? data.omni_channels
      //     : [],
      //   type_of_business: data.type_of_business,
      //   website: data.website,
      // };
      // const response: IPostVendorRegisterResponse = await venderRegister(
      //   payload
      // );
      // if (response?.status === 201) {
      //   toast.success("Vendor successfully registered.");
      //   router.push;("/dashboard");
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
      const basicInfoField: any = ["full_name", "user_name", "email", "phone"];
      const isValid = await methods.trigger(basicInfoField);

      if (isValid) {
        setActiveTab(TABS_STATUS.PROFILE_SETUP); // Move to next tab
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 md:pt-10 pt-5 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />
      <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
        <div className="flex justify-center md:text-[38px] text-2xl md:py-0 py-5 font-semibold">
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
          setActiveTabIndex={setActiveTab}
          activeTabIndex={activeTab}
        />
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col gap-3 relative"
          >
            {
              {
                [TABS_STATUS.BASIC_DETAILS]: <BasicInfoForm />,
                [TABS_STATUS.PROFILE_SETUP]: <ProfileSetup />,
                [TABS_STATUS.SOCIAL_MEDIA]: <SocialMedia />,
                [TABS_STATUS.PAYMENT_DETAILS]: <PaymentDetails />,
              }[activeTab]
            }
            <div className="flex bg-white">
              {activeTab !== TABS_STATUS.BASIC_DETAILS &&
                activeTab !== TABS_STATUS.PROFILE_SETUP && (
                  <Button
                    type="button"
                    className="w-fit bg-white text-black font-medium px-8"
                    size="small"
                    // onClick={() => activeTab < 3 && setActiveTab(activeTab + 1)}
                    onClick={() => {}}
                  >
                    {"Skip"}
                  </Button>
                )}

              {activeTab === TABS_STATUS.PROFILE_SETUP ? (
                <Button
                  type="submit"
                  className="w-fit font-medium px-8"
                  size="small"
                >
                  {"Save & Continue"}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="w-fit font-medium px-8"
                  size="small"
                  onClick={handleTriggerStepper}
                >
                  {"Save & Continue"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
