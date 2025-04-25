import SettingsLayout from "@/app/_components/pages/settings/settingsLayout";
import React, { ReactNode } from "react";

interface ILayout {
  children: ReactNode;
}


const settingMenus: {
  label: string;
  path: string;
}[] = [
    {
      label: "Profile",
      path: "/vendor/settings",
    },
    {
      label: "Package_details",
      path: "/vendor/settings/package",
    },
    {
      label: "Store_connects",
      path: "/vendor/settings/store",
    },
    {
      label: "Payment_options",
      path: "/vendor/settings/payment",
    },
    {
      label: "Blling_details",
      path: "/vendor/settings/billing",
    },
  ];

export default function template({ children, ...props }: ILayout) {
  return <SettingsLayout menus={settingMenus}>{children}</SettingsLayout>;
}
