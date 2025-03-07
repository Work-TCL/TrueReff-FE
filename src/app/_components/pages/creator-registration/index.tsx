"use client";
import React, { useState } from "react";
import { SlidingTabBar } from "../../components-common/tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { ICreatorFormSchema, creatorFormSchema } from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/app/_components/ui/button";
import BasicInfoForm from "./components/basic-details";
import SocialMedia from "./components/social-media";
import ProfileSetup from "./components/profile-setup";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { venderRegister } from "@/lib/web-api/auth";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { translate } from "@/lib/utils/translate";
import PaymentDetails from "./components/payment-details";
import { IPostCreatorRegisterRequest, IPostVendorRegisterRequest, IPostVendorRegisterResponse } from "@/lib/types-api/auth";

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

export default function CreatorRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();
  const [activeTab, setActiveTab] = useState<number>(TABS_STATUS.BASIC_DETAILS);
  const methods = useForm<ICreatorFormSchema>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
      profile_title: "",
      long_description: "",
      short_description: "",
      tags: [],
      category:[],
      sub_category:[]
    },
    resolver: yupResolver(creatorFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ICreatorFormSchema) => {
    setLoading(true);
    try {
      const payload: IPostCreatorRegisterRequest = {
        full_name: data?.full_name,
        user_name: data?.user_name,
        email: data?.email,
        phone_number: data?.phone_number,
        profile_title: data?.profile_title,
        long_description: data?.long_description,
        short_description: data?.short_description,
        tags: data?.tags,
        category: data?.category,
        sub_category: data?.sub_category,
        profile_image: data?.profile_image,
        banner_image: data?.banner_image
      };
      // const response: IPostVendorRegisterResponse = await venderRegister(payload);

      // if (response?.status === 201) {
      //   toast.success("Vendor successfully registered.");
      //   router.push("/dashboard");
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
        "phone_number"
      ];
      const isValid = await methods.trigger(basicInfoField);
    //   const response: any = await axios.get(
    //     `/vendor/check-exist/${methods.watch("company_email")}`
    //   );
    //   const alreadyExists = response?.data?.data?.alreadyExists;
    //   if (alreadyExists) {
    //     toast.error(translate("email_already_used"));
    //   }
      if (isValid ) {
        setActiveTab(TABS_STATUS.PROFILE_SETUP); // Move to next tab
      }
    } else if (TABS_STATUS.PROFILE_SETUP === activeTab) {
      const contactInfoField: any = ["contacts"];
      const isValid = await methods.trigger(contactInfoField);

      if (isValid) {
        setActiveTab(TABS_STATUS.SOCIAL_MEDIA); // Move to next tab
      }
    }
    setLoading(false);
  };
  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 md:pt-10 pt-5 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />
      <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
        <div className="flex justify-center text-[38px] font-semibold">
            {{
                [TABS_STATUS.BASIC_DETAILS]: "Creator Registration",
                [TABS_STATUS.PROFILE_SETUP]: "Complete Your Profile",
                [TABS_STATUS.SOCIAL_MEDIA]: "Connect Your Social Accounts",
                [TABS_STATUS.PAYMENT_DETAILS]: "Set Up Your Payment Info",
            }[activeTab]}
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
            {{
              [TABS_STATUS.BASIC_DETAILS]: <BasicInfoForm />,
              [TABS_STATUS.PROFILE_SETUP]: <ProfileSetup />,
              [TABS_STATUS.SOCIAL_MEDIA]: <SocialMedia />,
              [TABS_STATUS.PAYMENT_DETAILS]: <PaymentDetails />,
            }[activeTab]}
            <div className="flex bg-white">
              {(activeTab !== TABS_STATUS.BASIC_DETAILS && activeTab !== TABS_STATUS.PROFILE_SETUP) && <Button type="button" className="w-fit bg-white text-black font-medium px-8" size="small" onClick={()=> activeTab < 3 && setActiveTab(activeTab+1)}>{"Skip"}</Button>}
              {activeTab === TABS_STATUS.BASIC_DETAILS && <Button type="button" className="w-fit font-medium px-8" size="small" onClick={handleTriggerStepper}>{"Save & Continue"}</Button>}
              {activeTab === TABS_STATUS.PROFILE_SETUP && <Button type="submit" className="w-fit font-medium px-8" size="small" >{"Save & Continue"}</Button>}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
