"use client";
import { ILoginSchema, loginSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import Input from "@/lib/ui/form/Input";
import Button from "@/lib/ui/button";
import Link from "next/link";
import { MdOutlineEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { loginAPI } from "@/lib/web-api/auth";

export default function LoginForm() {
  const router = useRouter();
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
      const res: any = await loginAPI({
        email: data?.email,
        password: data?.password,
        // x,
      });

      console.log("res--login-", res);

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
          router?.push("/dashboard");
          methods?.reset();
          return true;
        }
      if (res?.ok) {
        toast.success("Login Successfully.");
        methods?.reset();
        router.push("/products");
        return true;
      }
      throw "Internal server error";
    } }catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log("error--->>", errorMessage);
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
        <div className="mt-3 text-[16px] flex align-middle justify-between  text-gray-600">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <span className="">Remember Me</span>
          </label>
          <Link href="/forgot-password" className="cursor-pointer text-sm">
            <span className="text-primary-color font-medium">
              Forgot password?
            </span>
          </Link>
        </div>
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
