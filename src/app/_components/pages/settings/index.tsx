"use client";
import React, { useState } from "react";
import Profile from "./profile";
import PackageDetails from "./package-details";
import PaymentOptions from "./payment-options";
import BillingDetails from "./billing-details";
import StoreConnects from "./store-connects";
import { translate } from "../../../../lib/utils/translate";
import Link from "next/link";

const settingMenus: string[] = [
  "Profile",
  "package_details",
  "store_connects",
  "payment_options",
  "billing_details",
];

export default function Settings() {
  const [active, setActive] = useState("Profile");

  const handleActiveMenu = (value: string) => {
    setActive(value);
  };

  return (
    <div className="flex-1">
      {
        {
          Profile: (
            <Profile
              profile={{
                business_name: "",
                company_email: "",
                company_phone: "",
                addresses: [],
                contacts: [],
              }}
            />
          ),
          // "package_details": <PackageDetails />,
          // "store_connects": <StoreConnects />,
          // "payment_options": <PaymentOptions />,
          // "billing_details": <BillingDetails />,
        }[active]
      }
    </div>
  );
}
