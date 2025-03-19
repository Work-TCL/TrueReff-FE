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
import { translate } from "@/lib/utils/translate";
import { IPostSignupRequest, IPostSignupResponse } from "@/lib/types-api/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface IRedirectPaths {
  [key: string]: string;
}
const redirectPaths: IRedirectPaths = {
  user: "/dashboard",
  vendor: "/vendor-register",
  creator: "/",
};

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const schema = registerSchema;
  const methods = useForm<IRegisterSchema>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IRegisterSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: IPostSignupRequest = {
        email: data?.email,
        password: data.password,
        type: userType
      };
      const response: IPostSignupResponse = await signUpAPI(payload);

      if (response?.status === 201 || response?.status === 200) {
        if (response?.data?.otpSent) {
          toast.success("Sent Email Successfully.");
          router?.push(`/email-verify?email=${data?.email}&type=${userType}`);
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
        <select className="border border-gray-light rounded-xl p-3" name="type" value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">select</option>
          <option value="vendor">vendor</option>
          <option value="creator">creator</option>
        </select>

        <label className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4"
            {...methods.register("terms")}
          />
          <span className="text-sm">
            {translate("By_Signing_up,_you_agree_to_our")}{" "}
            <span className="text-primary-color font-medium">
              {translate("Privacy_Policy")}
            </span>{" "}
            &{" "}
            <span className="text-primary-color font-medium">
              {translate("Terms_of_Use")}.
            </span>
          </span>
        </label>
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || !userType || loading}
        >
          {translate("Sign_up")}
        </Button>
      </form>
    </FormProvider>
  );
}
