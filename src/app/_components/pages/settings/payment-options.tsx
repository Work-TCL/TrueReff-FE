"use client";
import Button from "@/app/_components/ui/button";
import React from "react";

export default function PaymentOptions() {
  return (
    <div className="flex flex-col w-full lg:w-2/3 bg-white rounded-xl p-6 gap-4 shadow-md">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">Payment providers</h2>
        <p className="text-gray-500 text-[14px]">
          Connect PayPal or Stripe accounts to instantly accept payments from
          your audience.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center w-3/4 bg-[#FAFAFA] p-2 rounded-xl gap-3">
            <img src="/assets/settings/PayPal.svg" />
            PayPal
          </div>
          <Button className="w-1/4 p-4 md:text-base text-xs">
            Connect
          </Button>{" "}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center w-3/4 bg-[#FAFAFA] p-2 rounded-xl gap-3">
            <img src="/assets/settings/Stripe.svg" />
            Stripe
          </div>
          <Button className="w-1/4 p-4 md:text-base text-xs">
            Connect
          </Button>{" "}
        </div>
      </div>
    </div>
  );
}
