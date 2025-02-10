"use client";
import React, { useState } from "react";
import Profile from "./profile";
import PackageDetails from "./package-details";
import PaymentOptions from "./payment-options";
import BillingDetails from "./billing-details";
import StoreConnects from "./store-connects";

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
    <div className="flex flex-col xl:flex-row p-4 xl:p-6 gap-4">
      <div className="flex xl:flex-col flex-wrap overflow-auto gap-2 xl:gap-3 xl:w-1/4 w-full">
        {settingMenus.map((menu, index) => (
          <div
            className={`bg-white p-2 xl:p-4 rounded-xl border-black cursor-pointer w-full min-w-[180px] text-center xl:text-left 
                        ${active === menu ? "border-l-4" : ""}`}
            key={menu + "-" + index}
            onClick={() => handleActiveMenu(menu)}
          >
            {menu}
          </div>
        ))}
      </div>
      <div className="flex-1">
        {{
          Profile: <Profile />,
          "Package details": <PackageDetails/>,
          "Store connects": <StoreConnects/>,
          "Payment Options": <PaymentOptions/>,
          "Billing Details": <BillingDetails/>,
        }[active]}
      </div>
    </div>
  );
}
