"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { XCircle } from "lucide-react";

// Stripe / Razorpay redirect target when the end-user closes the checkout
// without paying. No state to clean up — we just send them back to the plan
// selector or billing home.
export default function BillingCancelPage() {
  const router = useRouter();
  const translate = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-xl shadow-md min-h-[300px]">
      <XCircle size={48} className="text-amber-500" />
      <h2 className="text-base xl:text-xl font-medium text-gray-darken">
        {translate("Payment_Canceled")}
      </h2>
      <p className="text-xs xl:text-sm text-gray-500 text-center">
        {translate("Payment_Canceled_Desc")}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => router.replace("/creator/billing/plans")}
          className="px-4 py-2 text-sm bg-primary-color text-white rounded-xl hover:opacity-90 transition-all"
        >
          {translate("View_Plans")}
        </button>
        <button
          onClick={() => router.replace("/creator/billing")}
          className="px-4 py-2 text-sm rounded-xl border border-gray-light text-gray-darken hover:bg-gray-50"
        >
          {translate("Back_To_Billing")}
        </button>
      </div>
    </div>
  );
}
