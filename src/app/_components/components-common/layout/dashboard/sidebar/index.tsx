"use client";

import React, { useState } from "react";
import {
  Home,
  Box,
  User,
  Megaphone,
  BarChart,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Store,
  PackageOpen,
  X,
  StepForward,
  StepBack,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { translate } from "../../../../../../lib/utils/translate";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { cn } from "@sohanemon/utils";
import {
  Tooltip,
  ToolTipProvider,
} from "@/app/_components/ui/tooltip/customTooltip";
import { useAuthStore } from "@/lib/store/auth-user";
import { BsChevronDown } from "react-icons/bs";

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
  childIndex,
}: any) => {
  const childLinkClasses = `relative block px-4 py-2 rounded-md ${
    isActive
      ? "bg-primary-color text-white"
      : "text-gray-500 hover:text-gray-700"
  } before:absolute before:-left-5 before:bottom-1/2 before:w-5 before:border-b-2 before:border-l-2 before:border-gray-300 before:rounded-bl-xl ${
    childIndex === 0 ? "before:h-7" : "before:h-16"
  } text-nowrap text-[14px]`;

  const classNames = isChild
    ? childLinkClasses
    : `relative flex ${
        hasSubmenu ? "justify-between" : ""
      } items-center text-[16px] cursor-pointer px-4 py-3 rounded-md text-nowrap  ${
        isActive
          ? hasSubmenu
            ? "bg-pink-100 text-black"
            : "bg-primary-color text-white"
          : "text-font-grey hover:bg-pink-100"
      }`;
  const iconClassNames = `w-5 h-5 shrink-0 ${
    isActive ? (hasSubmenu ? "text-black" : "text-white") : "text-font-grey"
  }`;
  if (hasSubmenu) {
    return (
      <div className={classNames} onClick={handleToggle}>
        <div className="flex gap-2">
          <div>{Icon && <Icon className={iconClassNames} />}</div>
          <div>{label}</div>
        </div>
        <div>
          <BsChevronDown
            className={`ml-auto w-5 h-5 transition-transform duration-300 ease-in-out ${
              expended ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <Link href={link} className={`${classNames} gap-3`} onClick={handleToggle}>
      {Icon && <Icon className={iconClassNames} />}
      {label && <span>{label}</span>}
    </Link>
  );
};
interface ISidebarProps {
  handleExpandSidebar: () => void;
  expanded: boolean;
  // role: string;
}
const Sidebar = ({ expanded, handleExpandSidebar }: ISidebarProps) => {
  const pathname = usePathname(); // Get the current path
  const { account: user } = useAuthStore();

  const lg = useMediaQuery("(min-width: 1024px)");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // New state for sidebar expansion
  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  const toggleMenu = (label: string, isSubMenu: boolean) => {
    let keys = Object.keys(expandedMenus).filter((key) => expandedMenus[key]);
    const obj = Object.fromEntries(keys.map((key) => [key, false]));
    setExpandedMenus((prev) => ({
      ...(isSubMenu ? obj : prev),
      [label]: !(isSubMenu ? obj : prev)[label],
    }));
  };
  const menuItems: MenuItem[] = [
    { label: translate("Overview"), icon: Home, link: "/vendor/dashboard" },
    {
      label: translate("Product_Catalog"),
      icon: Box,
      children: [
        // { label: translate("Add_New_Product"), link: "/vendor/products/add" },
        { label: translate("Product_List"), link: "/vendor/products" },
        { label: translate("Channels"), link: "/vendor/products/channels" },
      ],
    },
    {
      label: translate("Creators"),
      icon: UsersRound,
      children: [
        { label: translate("Creator_List"), link: "/vendor/creators" },
        {
          label: translate("Available_Creators"),
          link: "/vendor/creators/available-creators",
        },
      ],
    },
    {
      label: translate("Collaboration"),
      icon: UserRound,
      link: "/vendor/creators/collaboration",
    },
    {
      label: translate("Campaign"),
      icon: Megaphone,
      children: [
        { label: translate("Add_New_Campaign"), link: "/vendor/campaign/add" },
        { label: translate("Campaign_List"), link: "/vendor/campaign" },
        // { label: 'Campaign Metrics', link: '/campaign/metrics' },
      ],
    },
    // { label: translate("Bids"), icon: BarChart, link: "/bids" },
    // {
    //   label: translate("Brand_Analysis"),
    //   icon: BarChart,
    //   link: "/brand-analysis",
    // },
    // {
    //   label: translate("Account_Recharge"),
    //   icon: DollarSign,
    //   link: "/recharge",
    // },
    // { label: translate("Payments"), icon: DollarSign, link: "/payments" },
    // { label: translate("Support"), icon: LifeBuoy, link: "/support" },
    { label: translate("Settings"), icon: Settings, link: "/vendor/settings" },
  ];
  const creatorMenuItem: MenuItem[] = [
    {
      label: translate("Dashboard"),
      icon: LayoutGrid,
      link: "/creator/dashboard",
    },
    {
      label: translate("My_Store"),
      icon: Store,
      children: [
        {
          label: translate("Store_set_up"),
          link: "/creator/my-store/store-setup",
        },
        { label: translate("Product_List"), link: "/creator/my-store" },
      ],
    },
    {
      label: translate("Product_Management"),
      icon: Box,
      link: "/creator/product-management",
    },
    // {
    //   label: translate("Bidding_Management"),
    //   icon: BarChart,
    //   link: "/brand-analysis",
    // },
    {
      label: translate("Brands_List"),
      icon: Store,
      link: "/creator/brandsList",
    },
    {
      label: translate("Creator_Analysis"),
      icon: BarChart,
      link: "/creator/creator_analysis",
    },
    {
      label: translate("Collaboration"),
      icon: UserRound,
      link: "/creator/collaboration",
    },
    {
      label: translate("Payment_Earnings"),
      icon: DollarSign,
      link: "/creator/payment-earnings",
    },
    { label: translate("Settings"), icon: Settings, link: "/creator/settings" },
    // { label: translate("Support"), icon: LifeBuoy, link: "/support" },
    // { label: translate("Settings"), icon: Settings, link: "/settings" },
  ];

  const menu = {
    vendor: menuItems,
    creator: creatorMenuItem,
  }[user?.role || "vendor"];

  const handleToggleMenu = () => {
    let keys = Object.keys(expandedMenus).filter(
      (key) => expandedMenus[key] === true
    );
    const obj = Object.fromEntries(keys.map((key) => [key, false]));
    setExpandedMenus(obj);
  };
  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`lg:flex hidden relative max-w-[300px] h-screen bg-white flex-col top-0 left-0 z-40 transition-all duration-300 ease-in-out  ${
          isSidebarExpanded ? "w-[300px]" : "w-[75px]"
        }`}
      >
        <div className="flex justify-center gap-10  ">
          <div
            className={`p-4 text-primary-color font-bold text-4xl text-center`}
          >
            {!isSidebarExpanded ? (
              <PackageOpen />
            ) : (
              <img
                src="/assets/TrueReff-logo.svg"
                alt="Logo Image"
                className="md:w-auto max-w-40 w-full max-h-[88px] h-full mx-auto"
              />
            )}
          </div>
        </div>
        <nav className="flex flex-col space-y-2 px-3 overflow-auto overflow-x-hidden flex-1">
          {(menu ?? []).map((item, idx) => (
            <div key={idx} className="group">
              {isSidebarExpanded ? (
                item.children ? (
                  <div>
                    <NavLink
                      key={idx}
                      isActive={item.children.some((child) =>
                        pathname.includes(child.link)
                      )}
                      handleToggle={() => toggleMenu(item.label, false)}
                      label={isSidebarExpanded && item.label}
                      Icon={item.icon}
                      hasSubmenu
                      expended={expandedMenus[item.label]}
                    />
                    {expandedMenus[item.label] && (
                      <div className="ml-6 px-4">
                        <div className="flex flex-col gap-3 px-4 pt-2">
                          {item.children.map((child, idx) => (
                            <NavLink
                              key={idx}
                              link={child.link}
                              handleToggle={() => toggleMenu(item.label, true)}
                              isActive={pathname === child.link}
                              label={
                                !lg
                                  ? child.label
                                  : isSidebarExpanded
                                  ? child.label
                                  : ""
                              }
                              isChild
                              childIndex={idx}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={idx}
                    handleToggle={() => {
                      handleToggleMenu();
                    }}
                    link={item.link}
                    isActive={pathname === item.link}
                    Icon={item.icon}
                    label={isSidebarExpanded && item.label}
                  />
                )
              ) : item.children ? (
                <ToolTipProvider delayDuration={0}>
                  <Tooltip>
                    <Tooltip.Trigger>
                      <NavLink
                        key={idx}
                        isActive={item.children.some(
                          (child) => pathname === child.link
                        )}
                        handleToggle={() => toggleMenu(item.label, false)}
                        label={isSidebarExpanded && item.label}
                        Icon={item.icon}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-white rounded-r-md min-w-[230px] w-full px-2 py-[9px] text-gray-500 hover:text-gray-700"
                      side="right"
                    >
                      {item.children && item.children.length > 0 && (
                        <div className="flex flex-col gap-1 pl-4 ">
                          {item.children.map((child) => (
                            <Link
                              key={child.link}
                              href={child.link}
                              className={cn(
                                "text-gray-400 px-2 py-1 cursor-pointer rounded-sm ",
                                pathname === child.link
                                  ? "bg-primary-color text-white"
                                  : "text-gray-500 hover:text-gray-700",
                                pathname !== child.link && "hover:bg-pink-100"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </Tooltip.Content>
                  </Tooltip>
                </ToolTipProvider>
              ) : (
                <ToolTipProvider delayDuration={0}>
                  <Tooltip>
                    <Tooltip.Trigger>
                      <NavLink
                        key={idx}
                        handleToggle={() => {
                          handleToggleMenu();
                        }}
                        link={item.link}
                        isActive={pathname === item.link}
                        Icon={item.icon}
                        label={isSidebarExpanded && item.label}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-white rounded-r-md px-2 py-[9px] text-gray-500 hover:text-gray-700"
                      side="right"
                    >
                      <p className={`${"text-gray-500 hover:text-gray-700"}`}>
                        {item.label}
                      </p>
                    </Tooltip.Content>
                  </Tooltip>
                </ToolTipProvider>
              )}
            </div>
          ))}
        </nav>
        <div
          className={cn(
            "flex w-full shrink-0 cursor-pointer items-center p-1",
            isSidebarExpanded ? "justify-end pr-4" : "justify-center"
          )}
        >
          <button
            className="flex items-center justify-center rounded-full bg-primary-color text-white transition-all duration-300 w-10 h-10"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <StepBack className="cursor-pointer" />
            ) : (
              <StepForward className="cursor-pointer" />
            )}
          </button>
        </div>
      </aside>

      <aside
        id="sidebar-multi-level-sidebar"
        className={`max-w-[300px] w-full h-screen bg-white flex flex-col fixed top-0 left-0 lg:hidden z-40 transition-transform ${
          expanded ? "-translate-x-full" : "shadow-lg"
        }`}
      >
        <div className="flex justify-end  gap-10">
          <div className="p-4 pb-8 text-primary-color font-bold text-4xl text-center">
            truereff
          </div>
          <X
            className="size-6 shrink-0 mt-5 mr-2 cursor-pointer"
            onClick={handleExpandSidebar}
          />
        </div>
        <nav className="flex flex-col space-y-2 px-3 overflow-auto flex-1">
          {(menu ?? []).map((item, idx) => (
            <div key={idx} className="group">
              {item.children ? (
                <div>
                  <NavLink
                    key={idx}
                    isActive={item.children.some(
                      (child) => pathname === child.link
                    )}
                    handleToggle={() => toggleMenu(item.label, false)}
                    label={item.label}
                    Icon={item.icon}
                    hasSubmenu
                    expended={expandedMenus[item.label]}
                  />
                  {expandedMenus[item.label] && (
                    <div className="ml-6 px-4">
                      <div className="flex flex-col gap-3 px-4 pt-2">
                        {item.children.map((child, idx) => (
                          <NavLink
                            key={idx}
                            link={child.link}
                            handleToggle={() => toggleMenu(item.label, true)}
                            isActive={pathname === child.link}
                            label={child.label}
                            isChild
                            childIndex={idx}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={idx}
                  handleToggle={() => {
                    handleToggleMenu();
                  }}
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
    </>
  );
};

export default Sidebar;
