"use client";

import { Landmark, BadgeCheck, XCircle } from "lucide-react";
import React from "react";
import { IBankDetails } from ".";
import { useTranslations } from "next-intl";

interface IBankDetailProps {
  bankDetails: IBankDetails;
}

export default function BankDetails({ bankDetails }: IBankDetailProps) {
    const translate = useTranslations();
  const isVerified = bankDetails?.BeneficiaryData?.beneficiary_status === "VERIFIED";

  return (
    <div className="w-[90%] mx-auto bg-white rounded-2xl shadow-lg p-3 md:p-6 border mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{translate("Bank_Details")}</h2>
            <p className="text-sm text-gray-500">
              {isVerified ? translate("Verified_Account") : translate("Account_not_Verified")}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-medium ${
            isVerified
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isVerified ? <BadgeCheck size={14} /> : <XCircle size={14} />}
          {isVerified ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Bank Info */}
      <div className="space-y-4 text-sm">
        <InfoItem label={translate("Account_Holder_Name")} value={bankDetails?.BeneficiaryData?.beneficiary_name} />
        <InfoItem label={translate("Account_Number")} value={bankDetails?.accountNumber} />
        <InfoItem
          label={translate("IFSC_Code")}
          value={bankDetails?.ifsc}
        />
        <InfoItem
          label={translate("Mobile_Number")}
          value={bankDetails?.BeneficiaryData?.beneficiary_contact_details?.beneficiary_phone}
        />
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900 text-right">{value || "-"}</span>
  </div>
);
