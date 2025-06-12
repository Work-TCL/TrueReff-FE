"use client";
import { IRegisterSchema, registerSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { signUpAPI } from "@/lib/web-api/auth";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { MdOutlineEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { IPostSignupRequest, IPostSignupResponse } from "@/lib/types-api/auth";
import { useTranslations } from "next-intl";
import { Phone, User } from "lucide-react";
import Link from "next/link";
interface IRedirectPaths {
  [key: string]: string;
}
const redirectPaths: IRedirectPaths = {
  user: "/dashboard",
  vendor: "/vendor-register",
  creator: "/",
};

export default function RegisterForm() {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const schema = registerSchema;
  const methods = useForm<IRegisterSchema>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IRegisterSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: IPostSignupRequest = {
        name: data?.name,
        phone: data?.phone,
        email: data?.email,
        password: data.password,
      };
      const response: IPostSignupResponse = await signUpAPI(payload);

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data?.otpSent) {
          toast.success("Sent Email Successfully.");
          router?.push(`/email-verify?email=${data?.email}`);
          return true;
        }
        toast.success("Registered Successfully.");
        methods?.reset();
        router.push(redirectPaths[response?.data?.type]);
        return true;
      }
      throw response;
    } catch (error) {
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
          name="name"
          type="text"
          placeholder={translate("Name")}
          Icon={User}
          autoFocus
        />
        <Input
          name="phone"
          type="number"
          placeholder={translate("Phone")}
          Icon={Phone}
        />
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

        <label className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4"
            {...methods.register("terms")}
          />
          <span className="text-sm">
            {translate("By_Signing_up,_you_agree_to_our")}{" "}
            <Link
              href="/privacy-policy"
              className="text-primary-color font-medium"
            >
              {translate("Privacy_Policy")}
            </Link>{" "}
            &{" "}
            <Link
              href="/terms-condition"
              className="text-primary-color font-medium"
            >
              {translate("Terms_of_Use")}.
            </Link>
          </span>
        </label>
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          {translate("Sign_up")}
        </Button>
      </form>
    </FormProvider>
  );
}
