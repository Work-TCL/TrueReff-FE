"use client";

import React, { useState } from "react";
import {
  Home,
  Box,
  User,
  Megaphone,
  BarChart,
  DollarSign,
  LifeBuoy,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU } from "@/lib/utils/constants";

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  children?: { label: string; link: string }[];
};

const NavLink = ({
  link = "",
  isActive = false,
  Icon = undefined,
  label = "",
  hasSubmenu = false,
  handleToggle = () => {},
  expended = false,
  isChild = false,
}: any) => {
  const childLinkClasses = `relative block px-4 py-2 rounded-md ${
    isActive
      ? "bg-primary-color text-white"
      : "text-gray-500 hover:text-gray-700 hover:text-primary-color"
  } before:absolute before:-left-4 before:top-1/2 before:h-0.5 before:w-4 before:bg-gray-300 before:rounded-xl text-nowrap`;

  const classNames = isChild
    ? childLinkClasses
    : `group flex items-center px-4 py-3 space-x-3 rounded-md text-nowrap w-full  ${
        isActive
          ? "bg-primary-color text-white"
          : "text-font-grey hover:bg-pink-100 hover:text-primary-color"
      }`;
  const iconClassNames = `w-5 h-5 ${
    isActive ? "text-white" : "text-font-grey group-hover:text-primary-color"
  }`;
  if (hasSubmenu) {
    return (
      <div onClick={handleToggle} className={classNames}>
        {Icon && <Icon className={iconClassNames} />}
        <span>{label}</span>
        <ChevronRight
          className={`!ml-auto !text-xl transition-all font-thin ${
            expended
              ? isActive
                ? "text-white -rotate-90"
                : "text-black -rotate-90 group-hover:text-primary-color"
              : "rotate-90 group-hover:text-primary-color"
          }`}
        />
      </div>
    );
  }

  return (
    <Link href={link} className={classNames}>
      {Icon && <Icon className={iconClassNames} />}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // Get the current path
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems: MenuItem[] = Object.values(MENU);

  return (
    <aside className="max-w-[300px] w-full h-screen bg-white flex flex-col overflow-hidden">
      <div className="p-4 pb-8 text-primary-color font-bold text-4xl text-center">
        truereff
      </div>
      <nav className="flex flex-col space-y-2 px-3 pb-3 overflow-auto flex-1">
        {menuItems.map((item, idx) => (
          <div key={idx} className="group">
            {item.children ? (
              <div>
                <NavLink
                  key={idx}
                  isActive={item.children.some(
                    (child) => pathname === child.link
                  )}
                  handleToggle={() =>
                    Boolean(item.children) && toggleMenu(item.label)
                  }
                  label={item.label}
                  Icon={item.icon}
                  hasSubmenu
                  expended={
                    expandedMenus[item.label] ||
                    item.children.some((child) => pathname === child.link)
                  }
                />

                <div
                  className={`px-4 transition-all overflow-hidden ${
                    expandedMenus[item.label] ||
                    Boolean(
                      item.children.some((child) => pathname === child.link)
                    )
                      ? "h-fit"
                      : "h-0"
                  }`}
                >
                  <div className="px-4 border-l border-gray-300 pt-2">
                    {item.children.map((child, idx) => (
                      <NavLink
                        key={idx}
                        link={child.link}
                        isActive={pathname === child.link}
                        label={child.label}
                        isChild
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={idx}
                link={item.link}
                isActive={pathname === item.link}
                Icon={item.icon}
                label={item.label}
              />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
