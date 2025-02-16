"use client";
import { IForgotSchema, forgotSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Input from "@/lib/ui/form/Input";
import Button from "@/lib/ui/button";
import { forgotPassword } from "@/lib/web-api/auth";
import { MdOutlineEmail } from "react-icons/md";
import { translate } from "@/lib/utils/translate";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = forgotSchema;
  const methods = useForm<IForgotSchema>({
    defaultValues: {},
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IForgotSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: IForgotSchema = {
        email: data?.email,
      };
      const response: any = await forgotPassword(payload);

      if (response?.status === 200) {
        toast.success(response?.data?.message);
        methods?.reset();
        router.push(`/send-otp?email=${data?.email}`);
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
          placeholder={translate("Email")}
          Icon={MdOutlineEmail}
        />
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          {translate("Send OTP")}
        </Button>
      </form>
    </FormProvider>
  );
}
