"use client";
import { ILoginSchema, loginSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { loginAPI } from "@/lib/web-api/auth";
import Input from "@/lib/ui/form/Input";
import Button from "@/lib/ui/button";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const schema = loginSchema;
  const methods = useForm<ILoginSchema>({
    defaultValues: {},
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: ILoginSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: ILoginSchema = {
        email: data?.email,
        password: data.password,
      };
      const response: any = await loginAPI(payload);

      if (response?.status === 200) {
        // if (response?.data?.otpSent) {
        //   toast.success(response?.message || "Sent Email Successfully.");
        //   // navigate?.push(`?auth=verify&email=${data?.email}`);
        //   return true;
        // }

        const res = await signIn("credentials", {
          username: data?.email,
          password: data?.password,
          redirect: false,
        });

        if (res?.ok) {
          toast.success("Login Successfully.");
          methods?.reset();
          return true;
        }
        throw res;
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
        <Input name="email" type="email" placeholder="Email" />
        <Input name="password" type="password" placeholder="Password" />

        <div className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm">
            By Signing up, you agree to our{" "}
            <span className="text-primary-color font-medium">Privacy Policy</span> &{" "}
            <span className="text-primary-color font-medium">Terms of Use.</span>
          </span>
        </div>
        <Button type="submit" className="mt-3" loading={loading}>
          Sign up
        </Button>
      </form>
    </FormProvider>
  );
}
