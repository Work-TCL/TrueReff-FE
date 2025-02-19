"use client";
import Button from "@/app/_components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { otpSchema, IOtpSchema } from "@/lib/utils/validations";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { translate } from "@/lib/utils/translate";

export default function EmailVerifyOTPForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  console.log("email", email);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  let schema = otpSchema;
  const methods = useForm<IOtpSchema>({
    defaultValues: { otpCode: "" },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    methods.setValue("otpCode", otp);
  }, [otp, methods]);
  const onSubmit = async (data: IOtpSchema) => {
    console.log("data", data);
    if (!email || email == null) {
      return true;
    }
    setLoading(true);
    try {
      ("use server");
      const response: any = await signIn("credentials", {
        username: email,
        otp: data?.otpCode,
        redirect: false,
      });

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Email Verified Successfully.");
        methods?.reset();
        router.push("/dashboard");
        return true;
      }
      throw "Invalid OTP";
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
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span> </span>}
            renderInput={(props) => (
              <input
                {...props}
                className={`min-w-14 min-h-14 max-w-14 max-h-14 mr-4 rounded-lg border-[1.5px] focus:outline-none focus:border-black text-lg ${
                  props?.value ? "border-black" : "border-gray-dark"
                }`}
              />
            )}
          />
          <Button
            type="submit"
            className="mt-8"
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
