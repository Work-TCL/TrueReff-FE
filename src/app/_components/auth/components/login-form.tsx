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
      const res = await signIn("credentials", {
        username: data?.email,
        password: data?.password,
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Login Successfully.");
        methods?.reset();
        router.push("/dashboard");
        return true;
      }
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
        <div className="mt-3 text-[16px] flex align-middle justify-between  text-gray-600">
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <span className="">Remember Me</span>
          </div>
          <Link href="/forgot-password" className="cursor-pointer text-sm">
            <span className="text-primary-color font-medium">
              Forgot password?
            </span>
          </Link>
        </div>
        <Button type="submit" className="mt-3" loading={loading}>
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
