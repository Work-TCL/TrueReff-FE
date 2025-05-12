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
  creatorStoreSetUpSchema,
  ICreatorOnBoardingSchema,
  ICreatorSocialConnectSchema,
  ICreatorStoreSetUpSchema,
} from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/app/_components/ui/button";
import BasicInfoForm from "./components/basic-details";
import SocialMedia from "./components/social-media";
import toast from "react-hot-toast";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentDetails from "./components/payment-details";
import {
  IPostCreatorRegisterResponse,
  IPostCreatorRegisterStepOneRequest,
} from "@/lib/types-api/auth";
import {
  checkCreatorUserNameExist,
  creatorRegister,
  getCreatorProgress,
  socialMediaAdded,
} from "@/lib/web-api/auth";
import Loader from "../../components-common/layout/loader";
import { useCreatorStore } from "@/lib/store/creator";
import { useAuthStore } from "@/lib/store/auth-user";
import { fileUploadLimitValidator } from "@/lib/utils/constants";
import { toastMessage } from "@/lib/utils/toast-message";
import StoreSetup from "./components/store-setup";
import { CreditCard, FileText, Globe, Store } from "lucide-react";
import ProfileAccess from "../../components-common/dialogs/profile-approval";
import { useTranslations } from "next-intl";

let allTabs: {
  id: string;
  name: string;
  Icon: any;
}[] = [
    {
      id: "1",
      name: "Basic Details",
      Icon: FileText ,
    },
    {
      id: "2",
      name: "Social Media",
      Icon: Globe,
    },
    {
      id: "3",
      name: "Store Setup",
      Icon: Store,
    },
    {
      id: "4",
      name: "Payment Detail",
      Icon: CreditCard,
    },
  ];

const TABS_STATUS = {
  BASIC_DETAILS: 0,
  SOCIAL_MEDIA: 1,
  STORE_SETUP: 2,
  PAYMENT_DETAILS: 3,
};
export default function CreatorRegistrationPage() {
  const searchParams = useSearchParams();
  const translate = useTranslations();
  const { account } = useAuthStore();
  const { setCreatorData } = useCreatorStore();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? "0";
  const [activeTab,setActiveTab] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [youtubeConnected, setYoutubeConnected] = useState<boolean>(false);
  const [instagramConnected, setInstagramConnected] = useState<boolean>(false);
  const [isCreatorLoading, setIsCreatorLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [creatorDetails, setCreatorDetails] = useState<any>({ completed: 0 });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [channelError, setChannelError] = useState<string>("");
  const initialState = {
    state: "",
    city: "",
    gender: "",
    dob: "",
    userName:""
  };
  const [formState, setFormState] = useState(initialState);
  const methods = useForm<ICreatorOnBoardingSchema>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
      state:"",
      city: "",
      gender: "",
      dob:""
    },
    resolver: yupResolver(creatorOnBoardingSchema),
    mode: "onSubmit",
  });
  const storeMethods = useForm<ICreatorStoreSetUpSchema>({
    defaultValues: {
      store_name:"",
      store_description: "",
      tags: [],
      category: [],
      sub_category: [],
      profile_image: "",
      banner_image: "",
    },
    resolver: yupResolver(creatorStoreSetUpSchema),
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
  useEffect(()=> {
    if(tab){
      setActiveTab(parseInt(tab));
    }
  },[tab])
  useEffect(() => {
    if (account?.email) {
      methods.setValue("email", account?.email);
    }
  }, [account?.email]);
  const onSubmit = async (data: ICreatorOnBoardingSchema) => {
    setLoading(true);
    try {
      const payload: IPostCreatorRegisterStepOneRequest = {
        full_name: data.full_name,
        email: data?.email,
        phone: data.phone_number,
        user_name: data.user_name,
        state: data?.state,
        city: data?.city,
        gender: data?.gender,
        dob: data?.dob,
      };

      const response: any = await creatorRegister(
        payload,1
      );
      if (response?.status === 200) {
        setCreatorData("creator", {
          creatorId: response?.data?.id,
          accountId: response?.data?.accountId,
          full_name: response?.data?.full_name,
          user_name: response?.data?.user_name,
          email: response?.data?.email,
          phone: response?.data?.phone,
          dob: response?.data?.dob,
          gender: response?.data?.gender,
          state: response?.data?.state,
          city: response?.data?.city,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          tags: response?.data?.tags,
          channels: response?.data?.channels,
          completed_step: response?.data?.completed_step,
          status: response?.data?.status,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          completed: response?.data?.completed,
          instagram_link: response?.data?.instagram_link,
          youtube_link: response?.data?.youtube_link,
          banner_image: response?.data?.banner_image,
          profile_image: response?.data?.profile_image,
          store_description: response?.data?.store_description,
          store_name: response?.data?.store_name,
        });
        router.push(`?tab=1&creatorId=${response?.data?._id}`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const onStoreSetUpSubmit = async (data: ICreatorStoreSetUpSchema) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("store_name",data?.store_name);
      formData.append("store_description",data?.store_description);
      data.category.length > 0 && data.category.forEach((ele,index) => {
        formData.append(`category[${index}]`,ele?.value);
      })
      data.sub_category.length > 0 && data.sub_category.forEach((ele,index) => {
        formData.append(`sub_category[${index}]`,ele?.value);
      })
      data.tags.length > 0 && data.tags.forEach((ele,index) => {
        formData.append(`tags[${index}]`,ele);
      })
      if (bannerFile) {
        formData.append("banner_image",bannerFile);
      }
      if (profileFile) {
        formData.append("profile_image",profileFile);
      }
      console.log("formData",formData)
      const response: any = await creatorRegister(
        formData,3
      );
      if (response?.status === 200) {
        setOpen(true);
        setCreatorData("creator", {
          creatorId: response?.data?.id,
          accountId: response?.data?.accountId,
          full_name: response?.data?.full_name,
          user_name: response?.data?.user_name,
          email: response?.data?.email,
          phone: response?.data?.phone,
          dob: response?.data?.dob,
          gender: response?.data?.gender,
          state: response?.data?.state,
          city: response?.data?.city,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          tags: response?.data?.tags,
          channels: response?.data?.channels,
          completed_step: response?.data?.completed_step,
          status: response?.data?.status,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          completed: response?.data?.completed,
          instagram_link: response?.data?.instagram_link,
          youtube_link: response?.data?.youtube_link,
          banner_image: response?.data?.banner_image,
          profile_image: response?.data?.profile_image,
          store_description: response?.data?.store_description,
          store_name: response?.data?.store_name,
        });
        // router.push(`?tab=1&creatorId=${response?.data?._id}`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSocial = async () => {
    setLoading(true);
    try {    
      const formData = new FormData();
      let youtubeChannelLink = methodsSocial.getValues('channels.1.account_link');
      let instagramChannelLink = methodsSocial.getValues('channels.0.account_link');
      if (youtubeChannelLink || instagramChannelLink) {
        formData.append("instagram_link",instagramChannelLink);
        formData.append("youtube_link",youtubeChannelLink);
        const response: any = await creatorRegister(formData,2);
      if (response?.status === 200) {
        setCreatorData("creator", {
          creatorId: response?.data,
          accountId: response?.data?._id,
          full_name: response?.data?.full_name,
          user_name: response?.data?.user_name,
          email: response?.data?.email,
          phone: response?.data?.phone,
          dob: response?.data?.dob,
          gender: response?.data?.gender,
          state: response?.data?.state,
          city: response?.data?.city,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          tags: response?.data?.tags,
          channels: response?.data?.channels,
          completed_step: response?.data?.completed_step,
          status: response?.data?.status,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          completed: response?.data?.completed,
          instagram_link: response?.data?.instagram_link,
          youtube_link: response?.data?.youtube_link,
          banner_image: response?.data?.banner_image,
          profile_image: response?.data?.profile_image,
          store_description: response?.data?.store_description,
          store_name: response?.data?.store_name,
        });
        router.push(`?tab=2`);
        setChannelError("");
      }
      } else {
        setChannelError("Min 1 Channel required.");
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
    if (TABS_STATUS.STORE_SETUP === activeTab) {
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
    }
    setLoading(false);
  };

  const getCreator = async () => {
    setIsCreatorLoading(true);
    try {
      const creator: any = await getCreatorProgress();
      setCreatorDetails(creator);
      if (creator) {
        if (creator?.completed_step === 1) {
          router.push(
            `?tab=1`
          );
          setIsCreatorLoading(false);
        } else if (creator?.completed_step === 2) {
          router.push(
            `?tab=2`
          );
          setIsCreatorLoading(false);
        } else if (
          creator?.completed_step === 3 && creator?.status !== "APPROVED"
        ) {
          setOpen(true);
          setIsCreatorLoading(false);
          router.push(
            `?tab=2`
          );
          // router.push(`/creator/dashboard`);
        } else if(creator?.completed_step === 3 && creator?.status === "APPROVED"){
          router.push(`/creator/dashboard`);
        }
      }
      if (creator?._id) {
        methods.setValue("full_name",creator?.full_name);
        methods.setValue("user_name",creator?.user_name);
        methods.setValue("email",creator?.email);
        methods.setValue("phone_number",creator?.phone);
        methods.setValue("state",creator?.state);
        methods.setValue("city",creator?.city);
        methods.setValue("gender",creator?.gender);
        methods.setValue("dob",new Date(creator?.dob).toLocaleDateString());
        setFormState({
          state: creator?.state,
          city: creator?.city,
          gender: creator?.gender,
          dob: creator?.dob,
          userName: creator?.user_name
        })
        storeMethods.setValue("store_name",creator?.store_name);
        storeMethods.setValue("store_description",creator?.store_description);
        storeMethods.setValue("tags",creator?.tags);
        storeMethods.setValue("category",creator?.category);
        storeMethods.setValue("sub_category",creator?.sub_category);
        storeMethods.setValue("profile_image",creator?.profile_image);
        storeMethods.setValue("banner_image",creator?.banner_image);
        setBannerPreview(creator?.banner_image);
        setProfilePreview(creator?.profile_image);
        setCreatorData("creator", {
          creatorId: creator?.data?._id,
          accountId: creator?.data?.accountId,
          full_name: creator?.data?.full_name,
          user_name: creator?.data?.user_name,
          email: creator?.data?.email,
          phone: creator?.data?.phone,
          dob: creator?.data?.dob,
          gender: creator?.data?.gender,
          state: creator?.data?.state,
          city: creator?.data?.city,
          category: creator?.data?.category,
          sub_category: creator?.data?.sub_category,
          tags: creator?.data?.tags,
          channels: creator?.data?.channels,
          completed_step: creator?.data?.completed_step,
          status: creator?.data?.status,
          createdAt: creator?.data?.createdAt,
          updatedAt: creator?.data?.updatedAt,
          completed: creator?.data?.completed,
          instagram_link: creator?.data?.instagram_link,
          youtube_link: creator?.data?.youtube_link,
          banner_image: creator?.data?.banner_image,
          profile_image: creator?.data?.profile_image,
          store_description: creator?.data?.store_description,
          store_name: creator?.data?.store_name,
        });
      }
    } catch (e) {
    } finally {
      setIsCreatorLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getCreator();
    })();
  }, []);

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement> | any,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
      storeMethods.setValue("profile_image", previewURL);
      storeMethods.setError("profile_image", {
        type: "manual",
        message: "",
      });
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
      storeMethods.setValue("banner_image", previewURL);
      storeMethods.setError("banner_image", {
        type: "manual",
        message: "",
      });
    }
  };

  const handleOnSelect = (value: any, name: any) => {
    setFormState({ ...formState, [name]: value });
    methods.setValue(name, value);
    if (name === "state") {
      setFormState({ ...formState, [name]: value, city: "" });
      methods.setValue("city", "");
    }
    if (value) {
      methods.setError(name, {
        type: "manual",
        message: "",
      });
    }
  };

  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 md:pt-5 pt-5 pb-2  overflow-hidden flex flex-col">
      {isCreatorLoading && <Loader />}
      {!isCreatorLoading && (
        <>
          <HeaderAuth />
          <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
            <div className="flex justify-center md:text-[38px] text-2xl md:py-0 py-5 px-4 font-semibold">
              {
                {
                  [TABS_STATUS.BASIC_DETAILS]: "Creator Registration",
                  [TABS_STATUS.STORE_SETUP]: "Setup your Store",
                  [TABS_STATUS.SOCIAL_MEDIA]: "Connect Your Social Accounts",
                  [TABS_STATUS.PAYMENT_DETAILS]: "Set Up Your Payment Info",
                }[activeTab]
              }
            </div>
            <SlidingTabBar
              tabs={allTabs}
              setActiveTabIndex={(v) => {
                // if (
                //   [
                //     TABS_STATUS.BASIC_DETAILS,
                //     TABS_STATUS.STORE_SETUP,
                //     TABS_STATUS.SOCIAL_MEDIA,
                //   ].includes(activeTab) &&
                //   [
                //     TABS_STATUS.BASIC_DETAILS,
                //     TABS_STATUS.STORE_SETUP,
                //     TABS_STATUS.SOCIAL_MEDIA,
                //   ].includes(v)
                // ) {
                //   router.push(`?tab=${v}`);
                // }
              }}
              activeTabIndex={activeTab}
              grid={4}
            />
            {
              {
                [TABS_STATUS.BASIC_DETAILS]: <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="md:pt-6 mt-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
                  >
                    <BasicInfoForm
                      handleOnSelect={handleOnSelect}
                      methods={methods}
                      formState={formState}
                    />
                    <div className="flex bg-white">
                      <Button
                        type="submit"
                        className={cn(
                          "w-fit font-medium px-8")}
                        size="small"
                        loading={loading}
                        disabled={loading}
                      >
                        {translate("Save_and_Continue")}
                      </Button>
                    </div>
                  </form>
                </FormProvider>,
                [TABS_STATUS.SOCIAL_MEDIA]: <FormProvider {...methodsSocial}>
                  <form
                    className="md:pt-6 mt-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
                  >
                    <SocialMedia
                      setYoutubeConnected={setYoutubeConnected}
                      youtubeConnected={youtubeConnected}
                      setInstagramConnected={setInstagramConnected}
                      instagramConnected={instagramConnected}
                      methods={methodsSocial}
                      creator={creatorDetails}
                    />
                    <div className="flex items-center gap-4 bg-white">
                      <Button
                        className={cn(
                          "w-fit font-medium px-8"
                        )}
                        size="small"
                        onClick={onSubmitSocial}
                        loading={loading}
                        disabled={loading||!(instagramConnected||youtubeConnected)}
                      >
                        {translate("Save_and_Continue")}
                      </Button>
                      {channelError && <span className="text-red-600 text-sm">{channelError}</span>}
                    </div>
                  </form>
                </FormProvider>,
                [TABS_STATUS.STORE_SETUP]: <FormProvider {...storeMethods}>
                  <form
                    onSubmit={storeMethods.handleSubmit(onStoreSetUpSubmit)}
                    className="md:pt-6 mt-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
                  >
                    <StoreSetup
                      handleImageSelect={handleImageSelect}
                      profilePreview={profilePreview}
                      bannerPreview={bannerPreview}
                      methods={storeMethods}
                    />
                    <div className="flex bg-white">
                      <Button
                        type="submit"
                        className={cn("w-fit font-medium px-8", "block")}
                        size="small"
                        loading={loading}
                        disabled={loading}
                      >
                        {translate("Save_and_Continue")}
                      </Button>
                    </div>
                  </form>
                </FormProvider>,
                [TABS_STATUS.PAYMENT_DETAILS]: <FormProvider {...methodsSocial}>
                  <form
                    onSubmit={methodsSocial.handleSubmit(onSubmitSocial)}
                    className="md:pt-6 mt-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
                  >
                    <PaymentDetails />
                    <div className="flex bg-white">
                      <Button
                        type="button"
                        className="w-fit bg-white text-black font-medium px-8"
                        size="small"
                        onClick={() => {
                          activeTab < 2 && router.push(`?tab=${activeTab + 1}`);
                          if (activeTab === TABS_STATUS.SOCIAL_MEDIA) {
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
                        {translate("Save_and_Continue")}
                      </Button>
                    </div>
                  </form>
                </FormProvider>,
              }[activeTab]
            }
          </div>
        </>
      )}
      {open && <ProfileAccess />}
    </div>
  );
}
