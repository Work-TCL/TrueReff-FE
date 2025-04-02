"use client";
import React, { ReactNode } from "react";
import { translate } from "../../../../lib/utils/translate";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ISettingsLayout {
  children: ReactNode;
  menus: {
    label: string;
    path: string;
  }[];
}

export default function SettingsLayout({ children, menus = [] }: ISettingsLayout) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col xl:flex-row p-4 xl:p-6 gap-4">
      <div className="flex xl:flex-col flex-wrap overflow-auto gap-2 xl:gap-3 xl:max-w-[240px] w-full">
        {menus.map((menu, index) => (
          <Link
            href={menu.path}
            className={`bg-white p-2 xl:p-4 rounded-xl border-black cursor-pointer w-full min-w-[180px] text-center xl:text-left 
                        ${
                          pathname === menu.path
                            ? "border-l-4 font-medium"
                            : "text-font-grey"
                        }`}
            key={menu.path + "-" + index}
          >
            {translate(menu.label)}
          </Link>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
