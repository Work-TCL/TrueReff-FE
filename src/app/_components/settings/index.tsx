"use client";
import React, { useState } from "react";
import Profile from "./profile";
import PackageDetails from "./package-details";
import PaymentOptions from "./payment-options";
import BillingDetails from "./billing-details";
import StoreConnects from "./store-connects";
import { translate } from "../../../lib/utils/translate";
import Link from "next/link";

const settingMenus: string[] = [
  "Profile",
  "Package details",
  "Store connects",
  "Payment Options",
  "Billing Details",
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
          Profile: <Profile />,
          // "Package details": <PackageDetails />,
          // "Store connects": <StoreConnects />,
          // "Payment Options": <PaymentOptions />,
          // "Billing Details": <BillingDetails />,
        }[active]
      }
    </div>
  );
}
