"use client";
import { ILoginSchema, loginSchema } from "@/lib/utils/validations";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import Link from "next/link";
import { MdOutlineEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { loginAPI, SocialLoginAPI } from "@/lib/web-api/auth";
import { IPostLoginResponse } from "@/lib/types-api/auth";
import { useAuthStore } from "@/lib/store/auth-user";
import { USER_TYPE } from "@/lib/utils/constants";
import { useCreatorStore } from "@/lib/store/creator";
import { useVendorStore } from "@/lib/store/vendor";
import {
  clearRememberedUser,
  getRememberedUser,
  saveRememberedUser,
} from "@/lib/utils/rememberUtils";
import Loader from "@/app/_components/components-common/layout/loader";
import { useTranslations } from "next-intl";
import { messaging, generateToken } from "@/notifications/firebase";

import { onMessage } from "firebase/messaging";
import { toastMessage } from "@/lib/utils/toast-message";

export default function LoginForm() {
  const translate = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [messagingToken, setMessagingToken] = useState<string | null | undefined>(null);
  const schema = loginSchema;
  const { setAccountData, setIsAuthStatus, setToken } = useAuthStore();
  const { setCreatorData } = useCreatorStore();
  const { setVendorData } = useVendorStore();
  const methods = useForm<ILoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const commonLogin = (res: any) => {
    setIsAuthStatus("authenticated");
    setToken(res?.data?.token);

    if (isRemember) {
      saveRememberedUser(methods.watch("email"), methods.watch("password"));
    } else {
      clearRememberedUser();
    }

    setAccountData({
      email: res?.data?.email,
      id: res?.data?._id,
      role: res?.data?.type,
      name: res?.data?.name,
      phone: res?.data?.phone
    });
    if (
      !res?.data?.detailsFilled &&
      [USER_TYPE.Creator, USER_TYPE.Vendor].includes(res?.data?.type)
    ) {
      if (res?.data?.type === USER_TYPE.Creator) {
        setCreatorData("creator", {
          creatorId: res?.data?.creator?._id,
          accountId: res?.data?.creator?.accountId,
          full_name: res?.data?.creator?.full_name,
          user_name: res?.data?.creator?.user_name,
          email: res?.data?.creator?.email,
          phone: res?.data?.creator?.phone,
          dob: res?.data?.creator?.dob,
          gender: res?.data?.creator?.gender,
          state: res?.data?.creator?.state,
          city: res?.data?.creator?.city,
          category: res?.data?.creator?.category,
          sub_category: res?.data?.creator?.sub_category,
          tags: res?.data?.creator?.tags,
          channels: res?.data?.creator?.channels,
          completed_step: res?.data?.creator?.completed_step,
          status: res?.data?.creator?.status,
          createdAt: res?.data?.creator?.createdAt,
          updatedAt: res?.data?.creator?.updatedAt,
          completed: res?.data?.creator?.completed,
          instagram_link: res?.data?.creator?.instagram_link,
          youtube_link: res?.data?.creator?.youtube_link,
          banner_image: res?.data?.creator?.banner_image,
          profile_image: res?.data?.creator?.profile_image,
          store_description: res?.data?.creator?.store_description,
          store_name: res?.data?.creator?.store_name,
        });
      }
      if (res?.data?.type === USER_TYPE.Vendor) {
        let vendorData = res?.data?.vendor;
        setVendorData("vendor", {
          vendorId: vendorData?._id,
          accountId: vendorData?.accountId,
          category: vendorData?.category,
          sub_category: vendorData?.sub_category,
          completed_step: vendorData?.completed_step,
          contacts: vendorData?.contacts,
          business_name: vendorData?.business_name,
          company_email: vendorData?.company_email,
          pin_code: vendorData?.pin_code,
          type_of_business: vendorData?.type_of_business,
          website: vendorData?.website,
          state: vendorData?.state,
          city: vendorData?.city,
          address: vendorData?.address,
          profile_image: vendorData?.profile_image,
          banner_image: vendorData?.banner_image,
          createdAt: vendorData?.createdAt,
          updatedAt: vendorData?.updatedAt,
          gst_certificate: vendorData?.gst_certificate,
          gst_number: vendorData?.gst_number,
          pan_number: vendorData?.pan_number,
          channelConfig: vendorData?.channelConfig,
          channelId: vendorData?.channelId,
          channelStatus: vendorData?.channelStatus,
          channelType: vendorData?.channelType,
          status: vendorData?.status,
        })
      }
      setIsAuthStatus("authenticated");
      if (res?.data?.type === USER_TYPE.Vendor) {
        if(((res?.data?.vendor?.completed_step === 1) || (res?.data?.vendor?.completed_step === 2) || res?.data?.vendor?.completed_step === 3)&& res?.data?.vendor?.status !== "APPROVED"){
          router.push("/vendor-register");
        } else if(res?.data?.vendor?.completed_step === 3 && res?.data?.vendor?.status === "APPROVED"){
          router.push("/vendor/dashboard");
        } else router.push("/dashboard");
      } else if (res?.data?.type === USER_TYPE.Creator) {
        if((res?.data?.creator?.completed_step === 1 || res?.data?.creator?.completed_step === 2 ||res?.data?.creator?.completed_step === 3) &&  res?.data?.creator?.status !== "APPROVED"){
          router.push("/creator-registration");
        } else if(res?.data?.creator?.completed_step === 3 &&  res?.data?.creator?.status === "APPROVED"){
          router.push("/creator/dashboard");
        }
        else router.push("/dashboard");
      } else {
        router?.push(`/creator-registration`);
      }
    } else {
      if (res?.data?.type === USER_TYPE.Vendor) {
        if(((res?.data?.vendor?.completed_step === 1) || (res?.data?.vendor?.completed_step === 2) || res?.data?.vendor?.completed_step === 3)&& res?.data?.vendor?.status !== "APPROVED"){
          router.push("/vendor-register");
        } else if(res?.data?.vendor?.completed_step === 3 && res?.data?.vendor?.status === "APPROVED"){
          router.push("/vendor/dashboard");
        } else router.push("/dashboard");
      } else if (res?.data?.type === USER_TYPE.Creator) {
        if((res?.data?.creator?.completed_step === 1 || res?.data?.creator?.completed_step === 2 ||res?.data?.creator?.completed_step === 3) &&  res?.data?.creator?.status !== "APPROVED"){
          router.push("/creator-registration");
        } else if(res?.data?.creator?.completed_step === 3 &&  res?.data?.creator?.status === "APPROVED"){
          router.push("/creator/dashboard");
        }
        else router.push("/dashboard");
      } else {
        router?.push(`/dashboard`);
      }
    }
  };

  const onSubmit = async (data: ILoginSchema) => {
    setLoading(true);
    setIsAuthStatus("loading");
    try {
      ("use server");
      const res: IPostLoginResponse | any = await loginAPI({
        email: data?.email,
        password: data?.password,
      });
      if (res?.status === 200 || res?.status === 201) {
        if (res?.data?.otpSent) {
          toast.success("Sent Email Successfully.");
          router?.push(`/email-verify?email=${data?.email}`);
          return true;
        }
        const response = await signIn("credentials", {
          username: data?.email,
          password: data?.password,
          redirect: false,
        });
        if (response?.ok) {
          toast.success("Login Successfully.");
          await commonLogin(res);
          methods?.reset();
          return true;
        }
        throw "Internal server error";
      }
    } catch (error) {
      setIsAuthStatus("unauthenticated");
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const remembered = getRememberedUser();
    if (remembered?.email) {
      methods.setValue("email", remembered.email);
      methods.setValue("password", remembered.password);
      setIsRemember(true);
      methods.trigger(["email", "password"]);
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(async () => {
          console.log("Service Worker registered");
          const token = await generateToken();
          console.log("FCM Token:", token);
          setMessagingToken(token);
        })
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  useEffect(() => {
    if (!messaging) return; 
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // Handle foreground messages
      toastMessage.info(payload?.notification?.title || "New Notification");
    });
  }, [messaging]); 

  useEffect(() => {
    if (token) {
      (async () => {
        setLoadingPage(true);
        try {
          const res: any = await SocialLoginAPI({
            accessToken: token,
          });

          if (res?.status === 200 || res?.status === 201) {
            const response = await signIn("credentials", {
              username: res?.data?.email,
              token: token,
              redirect: false,
            });
            if (response?.ok) {
              toast.success("Login Successfully.");
              await commonLogin(res);
              methods?.reset();
              return true;
            }
            throw "Internal server error";
          }
        } catch (error) {
          toast.error("social login failed.");
        } finally {
          setLoadingPage(false);
        }
      })();
    }
  }, [token]);

  const handleCopyToken = async () => {
      try {
        await navigator.clipboard.writeText(messagingToken ?? "");
        toastMessage.success("Token copied to clipboard!");
      } catch (err) {
        toastMessage.error("Failed to copy!");
      }
    };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        {loadingPage && <Loader />}
        <Input
          name="email"
          type="text"
          placeholder={translate("Enter_your_email_or_phone_number")}
          Icon={MdOutlineEmail}
          autoFocus
        />
        <Input
          name="password"
          type="password"
          placeholder={translate("Enter_your_password")}
          Icon={PiLockKey}
        />
        <div className="mt-3 text-[16px] flex align-middle justify-between  text-gray-600">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isRemember}
              className="w-4 h-4"
              onChange={(e) => {
                setIsRemember(e?.target?.checked);
              }}
            />
            <span className="">{translate("Remember_Me")}</span>
          </label>
          <Link href="/forgot-password" className="cursor-pointer text-sm">
            <span className="text-primary-color font-medium">
              {translate("Forgot_Password?")}
            </span>
          </Link>
        </div>
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          {translate("Login")}
        </Button>
      </form>
      {messagingToken && <div className="flex items-center">
        <p className="text-sm text-gray-500 mt-4">
          {messagingToken?.slice(0, 20)}...
        </p>
        <Button
          type="button"
          className="mt-3 w-[100px]"
          // loading={loading}
          disabled={!messagingToken}
          onClick={handleCopyToken}
        >
          {translate("Copy")}
        </Button>
      </div>}
    </FormProvider>
  );
}
