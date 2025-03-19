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
import { verifyOtp } from "@/lib/web-api/auth";
import { useSearchParams } from "next/navigation";
import { translate } from "@/lib/utils/translate";
import { IPostVerifyOTPRequest, IPostVerifyOTPResponse } from "@/lib/types-api/auth";

export default function VerifyOTPForm() {
  const searchParams = useSearchParams();
  const email: string = searchParams.get("email") || '';
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
