"use client";
import Button from "@/app/_components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { otpSchema, IOtpSchema } from "@/lib/utils/validations";
import { signIn } from "next-auth/react";
import { translate } from "@/lib/utils/translate";

export default function EmailVerifyOTPForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("vendor");
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async (data: IOtpSchema) => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const response: any = await signIn("credentials", {
        username: email,
        otp: data?.otpCode,
        redirect: false,
      });

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Email Verified Successfully.");
        methods.reset();

        localStorage.setItem("userType", userType);

        if (userType === "vendor") {
          router.push("/pre-form");
        } else if (userType === "creator") {
          router.push(`/creator-registration?email=${email}`);
        } else {
          router.push("/dashboard");
        }
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
                className={`min-w-14 min-h-14 max-w-14 max-h-14 mr-4 rounded-lg border-[1.5px] 
                  focus:outline-none focus:border-black text-lg ${
                    props?.value ? "border-black" : "border-gray-dark"
                  }`}
              />
            )}
          />
          <Button
            type="submit"
            className="mt-8"
            loading={loading}
            disabled={!otp || otp.length !== 6 || loading}
          >
            {translate("Verify")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
