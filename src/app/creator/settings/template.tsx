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
    path: "/creator/settings",
  },
  {
    label: "Channel_connects",
    path: "/creator/settings/store",
  },
];

export default function template({ children, ...props }: ILayout) {
  return <SettingsLayout menus={settingMenus}>{children}</SettingsLayout>;
}
