"use client";
import { ILoginSchema, loginSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { loginAPI } from "@/lib/web-api/auth";
import { translate } from "@/lib/utils/translate";
import { IPostLoginResponse } from "@/lib/types-api/auth";
import { useAuthStore } from "@/lib/store/auth-user";
import { USER_TYPE } from "@/lib/utils/constants";
import { useCreatorStore } from "@/lib/store/creator";
import { useVendorStore } from "@/lib/store/vendor";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
          setIsAuthStatus("authenticated");
          setToken(res?.data?.token);
          if (
            !res?.data?.detailsFilled &&
            [USER_TYPE.Creator, USER_TYPE.Vendor].includes(res?.data?.type)
          ) {
            setAccountData({
              email: res?.data?.email,
              id: res?.data?._id,
              role: res?.data?.type,
              name: res?.data?.name,
            });
            if (res?.data?.type === USER_TYPE.Creator) {
              setCreatorData("creator", {
                creatorId: res?.data?.creator?._id,
                accountId: res?.data?._id,
                full_name: res?.data?.creator?.full_name,
                user_name: res?.data?.creator?.user_name,
                title: res?.data?.creator?.title,
                phone: res?.data?.creator?.phone,
                banner_image: res?.data?.creator?.banner_image,
                profile_image: res?.data?.creator?.profile_image,
                category: res?.data?.creator?.category,
                sub_category: res?.data?.creator?.sub_category,
                tags: res?.data?.creator?.tags,
                channels: res?.data?.creator?.channels,
                completed: res?.data?.creator?.completed,
                short_description: res?.data?.creator?.short_description,
                long_description: res?.data?.creator?.long_description,
              });
            }
            if (res?.data?.type === USER_TYPE.Vendor) {
              setVendorData("vendor", {
                vendorId: res?.data?.vendor?._id,
                accountId: res?.data?._id,
                business_name: res?.data?.vendor?.business_name,
                company_email: res?.data?.vendor?.company_email,
                company_phone: res?.data?.vendor?.company_phone,
                gst_number: res?.data?.vendor?.gst_number,
                website: res?.data?.vendor?.website,
                type_of_business: res?.data?.vendor?.type_of_business,
                contacts: res?.data?.vendor?.contacts,
                omni_channels: res?.data?.vendor?.omni_channels,
                brand_documents: res?.data?.vendor?.brand_documents,
                addresses: res?.data?.vendor?.addresses,
              });
            }
            setIsAuthStatus("authenticated");
            if (res?.data?.type === USER_TYPE.Vendor) {
              router?.push("/vendor-register");
            } else if (res?.data?.creator?.completed === 50) {
              router.push("/creator/dashboard");
            } else {
              router?.push(`/creator-registration`);
            }
          } else {
            router?.push(`/dashboard`);
          }
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
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        <Input
          name="email"
          type="email"
          placeholder={translate("Email")}
          Icon={MdOutlineEmail}
        />
        <Input
          name="password"
          type="password"
          placeholder={translate("Password")}
          Icon={PiLockKey}
        />
        <div className="mt-3 text-[16px] flex align-middle justify-between  text-gray-600">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
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
    </FormProvider>
  );
}
