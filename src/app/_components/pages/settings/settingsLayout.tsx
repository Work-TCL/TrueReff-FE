"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Globe, User } from "lucide-react";

interface ISettingsLayout {
  children: ReactNode;
  type: "vendor" | "creator";
}
const settingMenus: {
  label: string;
  path: string;
  icon: any;
}[] = [
  {
    label: "Profile",
    path: "/creator/settings",
    icon: User
  },
  {
    label: "channels_connect",
    path: "/creator/settings/store",
    icon: Globe
  },
];
const vendorSettingMenus: {
  label: string;
  path: string;
  icon: any;
}[] = [
  {
    label: "Profile",
    path: "/vendor/settings",
    icon: User
  },
  // {
  //   label: "package_details",
  //   path: "/vendor/settings/package",
  // },
  {
    label: "store_connects",
    path: "/vendor/settings/store",
    icon: Globe
  },
  // {
  //   label: "payment_options",
  //   path: "/vendor/settings/payment",
  // },
  // {
  //   label: "billing_details",
  //   path: "/vendor/settings/billing",
  // },
];
export default function SettingsLayout({
  children,
  type = "vendor",
}: ISettingsLayout) {
  const menus = {vendor: vendorSettingMenus, creator: settingMenus}[type];
  const translate = useTranslations();
  const pathname = usePathname();
  return (
    <div className="flex flex-col md:flex-row p-2 md:p-4 xl:p-6 gap-2 md:gap-4">
      <div className="flex md:flex-col lg:flex-col xl:flex-col justify-center md:justify-start overflow-auto gap-2 xl:gap-3 md:max-w-[240px] w-full">
        {menus.map((menu, index) => (
          <Link
            href={menu.path}
            className={`bg-white p-2 xl:p-4 rounded-xl border-primary cursor-pointer md:min-w-[180px] text-center md:text-left 
                        ${
                          pathname === menu.path
                            ? "border-l-4 border-r-4 md:border-r-0 font-medium text-primary"
                            : "border-l-4 border-r-4 md:border-r-0 text-font-grey border-white"
                        }`}
            key={menu.path + "-" + index}
          >
            <menu.icon className="md:hidden block" />
            <span className="hidden md:block">{translate(menu.label)}</span>
          </Link>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
