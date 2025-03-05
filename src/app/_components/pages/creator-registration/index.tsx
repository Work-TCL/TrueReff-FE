"use client";
import React, { useState } from "react";
import { SlidingTabBar } from "../../components-common/tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { IPreFormSchema, preFormSchema } from "@/lib/utils/validations";
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
  const methods = useForm<IPreFormSchema>({
    defaultValues: {
      business_name: "",
      company_email: "",
      company_phone: "",
      contacts: [
        {
          name: "",
          phone: "",
          email: "",
        },
        {
          name: "",
          phone: "",
          email: "",
        },
      ],
      gst_number: "",
      type_of_business: "",
      website: "",
      omni_channels: []
    },
    resolver: yupResolver(preFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: IPreFormSchema) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
      };
      const response: any = await venderRegister(payload);

      if (response?.status === 201) {
        toast.success("Vendor successfully registered.");
        router.push("/dashboard");
      }
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
    //   const basicInfoField: any = [
    //     "business_name",
    //     "company_email",
    //     "company_phone",
    //     "gst_number",
    //     "website",
    //     "type_of_business",
    //   ];
    //   const isValid = await methods.trigger(basicInfoField);
    //   const response: any = await axios.get(
    //     `/vendor/check-exist/${methods.watch("company_email")}`
    //   );
    //   const alreadyExists = response?.data?.data?.alreadyExists;
    //   if (alreadyExists) {
    //     toast.error(translate("email_already_used"));
    //   }
    //   if (isValid && !alreadyExists) {
    //     setActiveTab(TABS_STATUS.CONTACT_INFO); // Move to next tab
    //   }
    // } else if (TABS_STATUS.CONTACT_INFO === activeTab) {
    //   const contactInfoField: any = ["contacts"];
    //   const isValid = await methods.trigger(contactInfoField);

    //   if (isValid) {
    //     setActiveTab(TABS_STATUS.OMNI_CHANNEL); // Move to next tab
    //   }
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
              <Button type="button" className="w-fit font-medium px-8" size="small" onClick={()=> activeTab < 3 && setActiveTab(activeTab+1)}>{"Save & Continue"}</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
