"use client";
import Button from "@/app/_components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { otpSchema, IOtpSchema, IForgotSchema } from "@/lib/utils/validations";
import { forgotPassword, verifyOtp } from "@/lib/web-api/auth";
import { useSearchParams } from "next/navigation";
import {
  IPostForgotPasswordResponse,
  IPostVerifyOTPRequest,
  IPostVerifyOTPResponse,
} from "@/lib/types-api/auth";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { RiLoader3Fill } from "react-icons/ri";
import { formatTime } from "@/lib/utils/constants";

export default function VerifyOTPForm() {
  const translate = useTranslations();
  const searchParams = useSearchParams();
  const email: string = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  let schema = otpSchema;
  const methods = useForm<IOtpSchema>({
    defaultValues: { otpCode: "" },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    methods.setValue("otpCode", otp);
  }, [otp, methods]);
  useEffect(() => {
    let interval: any;
    if (disabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, disabled]);
  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const payload: IForgotSchema = {
        email,
      };
      const response: IPostForgotPasswordResponse = await forgotPassword(
        payload
      );

      if (response?.status === 200) {
        toast.success(response?.data?.message);
        setTimer(60);
        setDisabled(true);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  }
  const onSubmit = async (data: IOtpSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: IPostVerifyOTPRequest = {
        email: email,
        otpCode: data?.otpCode,
      };
      const response: IPostVerifyOTPResponse = await verifyOtp(payload);

      if (response?.status === 200) {
        toast.success(response?.data?.message);
        methods?.reset();
        router.push(`/reset-password?email=${email}`);
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
        className="w-full flex flex-col md:items-start items-center gap-3"
      >
        <div className="flex flex-col md:items-start items-center gap-4">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span> </span>}
            renderInput={(props, index) => (
              <input
                {...props}
                autoFocus={index === 0}
                className={`md:min-w-14 min-w-10 md:min-h-14 min-h-10 max-w-14 max-h-14 mr-2 md:mr-4 rounded-lg border-[1.5px] focus:outline-none focus:border-black text-lg ${
                  props?.value ? "border-black" : "border-gray-dark"
                }`}
              />
            )}
          />
          <span onClick={() => (!disabled && !resendLoading) && resendOtp()} className={cn("md:text-sm text-xs",!disabled ? "hover:cursor-pointer hover:underline text-primary":"text-secondary")}>{resendLoading ? <RiLoader3Fill className="animate-spin text-center duration-300 text-xl" /> : disabled ? <span>Resend OTP in <span className="text-primary">{formatTime(timer)}</span></span> : "Resend OTP"}</span>
          <Button
            type="submit"
            className="w-1/3 flex justify-center"
            loading={loading}
            disabled={!otp || otp?.split("").length != 6 || loading}
          >
            {translate("Verify")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
