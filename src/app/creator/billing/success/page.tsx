"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

// Stripe / Razorpay redirect lands here after a successful checkout. The
// subscription is created server-side via webhook — we just bounce the user
// back to the billing dashboard once it has a moment to settle.
export default function BillingSuccessPage() {
  const router = useRouter();
  const translate = useTranslations();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/creator/billing"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 bg-white rounded-xl shadow-md min-h-[300px]">
      <CheckCircle2 size={48} className="text-green-500" />
      <h2 className="text-base xl:text-xl font-medium text-gray-darken">
        {translate("Payment_Successful")}
      </h2>
      <p className="text-xs xl:text-sm text-gray-500 text-center">
        {translate("Payment_Successful_Desc")}
      </p>
      <button
        onClick={() => router.replace("/creator/billing")}
        className="mt-2 px-4 py-2 text-sm bg-primary-color text-white rounded-xl hover:opacity-90 transition-all"
      >
        {translate("Go_To_Billing")}
      </button>
    </div>
  );
}
