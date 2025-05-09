"use client";
import React, { useState } from "react";
import Profile from "./profile";
import { useTranslations } from "next-intl";

const settingMenus: string[] = [
  "Profile",
  "package_details",
  "store_connects",
  "payment_options",
  "billing_details",
];

export default function Settings() {
  const translate = useTranslations();
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
            // profile={{
            //   business_name: "",
            //   company_email: "",
            //   company_phone: "",
            //   addresses: [],
            //   contacts: [],
            // }}
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
