"use client";
import Button from "@/app/_components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn, getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { otpSchema, IOtpSchema } from "@/lib/utils/validations";
import { signIn } from "next-auth/react";
import { verifyEmail } from "@/lib/web-api/auth";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { RiLoader3Fill } from "react-icons/ri";
import { formatTime } from "@/lib/utils/constants";

export default function EmailVerifyOTPForm() {
  const translate = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("vendor");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [disabled, setDisabled] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  const methods = useForm<IOtpSchema>({
    defaultValues: { otpCode: "" },
    resolver: yupResolver(otpSchema),
    mode: "onChange",
  });

  // ✅ Fetch search params safely inside `useEffect`
  useEffect(() => {
    setEmail(searchParams.get("email"));
    setUserType(searchParams.get("type") ?? "vendor");
  }, [searchParams]);

  // ✅ Sync OTP state with react-hook-form
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
      const response: any = await axios.post(`/auth/register-resend-otp`, {
        email
      });

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
  };

  const onSubmit = async (data: IOtpSchema) => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyEmail({
        email: email,
        otpCode: data?.otpCode,
      });
      const userData = response?.data;
      const result = await signIn("credentials", {
        redirect: false,
        username: email,
        otp: data?.otpCode,
        // Optional: Pass additional fields to "authorize"
        userData: JSON.stringify(userData), // send everything you want stored
      });
      if (result?.status === 200 || result?.status === 201) {
        toast.success("Email Verified Successfully.");
        methods.reset();
        router.push("/dashboard");
        return;
      }

      throw new Error("Invalid OTP");
    } catch (error) {
      toast.error(getErrorMessage(error));
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
