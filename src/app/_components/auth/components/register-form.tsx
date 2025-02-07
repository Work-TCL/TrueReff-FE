"use client";
import { IRegisterSchema, registerSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { signUpAPI } from "@/lib/web-api/auth";
import Input from "@/lib/ui/form/Input";
import Button from "@/lib/ui/button";
import { MdOutlineEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
interface IRedirectPaths {
  [key: string]: string;
}
const redirectPaths: IRedirectPaths = {
  "user": '/dashboard',
  "vendor": '/pre-form',
  "creator": '/'
}

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = registerSchema;
  const methods = useForm<IRegisterSchema>({
    defaultValues: {},
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: IRegisterSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: IRegisterSchema = {
        email: data?.email,
        password: data.password,
      };
      const response: any = await signUpAPI({ ...payload, type: "vendor" });
      console.log("res---vendor--", response);

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
          name="email"
          type="email"
          placeholder="Email"
          Icon={MdOutlineEmail}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          Icon={PiLockKey}
        />

        <label className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4"
            {...methods.register("terms")}
          />
          <span className="text-sm">
            By Signing up, you agree to our{" "}
            <span className="text-primary-color font-medium">
              Privacy Policy
            </span>{" "}
            &{" "}
            <span className="text-primary-color font-medium">
              Terms of Use.
            </span>
          </span>
        </label>
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          Sign up
        </Button>
      </form>
    </FormProvider>
  );
}
