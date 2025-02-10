"use client";
import Button from "@/lib/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { otpSchema, IOtpSchema } from "@/lib/utils/validations";
import { verifyOtp } from "@/lib/web-api/auth";
import { useSearchParams } from "next/navigation";

export default function VerifyOTPForm() {
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
    mode: "onSubmit",
  });
  useEffect(() => {
    methods.setValue("otpCode", otp);
  }, [otp, methods]);
  const onSubmit = async (data: IOtpSchema) => {
    console.log("data", data);
    setLoading(true);
    try {
      ("use server");
      const payload: IOtpSchema = {
        otpCode: data?.otpCode,
      };
      const response: any = await verifyOtp({ ...payload, email: email });

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
                className={`min-w-14 min-h-14 max-w-14 max-h-14 mr-4 rounded-lg border-[1.5px] rounded focus:outline-none focus:border-black text-lg ${
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
            Verify
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
