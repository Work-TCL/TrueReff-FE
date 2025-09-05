"use client";

import React, { useEffect, useState } from "react";
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
  ArrowDownToLine,
  SquareUserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import {
  Tooltip,
  ToolTipProvider,
} from "@/app/_components/ui/tooltip/customTooltip";
import { useAuthStore } from "@/lib/store/auth-user";
import { BsChevronDown } from "react-icons/bs";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/commonUtils";
import { useCreatorStore } from "@/lib/store/creator";
import { toastMessage } from "@/lib/utils/toast-message";
import Image from "next/image";
import { useNotificationStore } from "@/lib/store/notifications";

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  children?: { label: string; link: string }[];
  notification: boolean;
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
  childClassName,
  handleInstall = () => {},
  item = null 
}: any) => {
  const childLinkClasses = `relative block px-4 py-2 rounded-md ${
    isActive
      ? "bg-primary-color text-white"
      : "text-gray-500 hover:text-gray-700"
  } before:absolute before:-left-5 before:bottom-1/2 before:w-5 before:border-b-2 before:border-l-2 before:border-gray-300 before:rounded-bl-xl ${
    childIndex === 0 ? "before:h-7" : "before:h-16"
  } text-nowrap text-[14px] ${childClassName}`;

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
      } `;
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
  if (link === "install-app") {
    return (
      <span className={`${classNames} gap-3`} onClick={handleInstall}>
        {Icon && <Icon className={iconClassNames} />}
        {label && <span>{label}</span>}
      </span>
    );
  } else {
    return (
      <Link
        href={link}
        className={`${classNames} gap-3`}
        onClick={handleToggle}
      >
        {Icon && <Icon className={iconClassNames} />}
        {label && <span>{label}</span>}
        {item?.notification && (
          <span className="absolute top-[5px] right-[7px] block h-1 w-1 rounded-full bg-primary-color"></span>
        )}
      </Link>
    );
  }
};

interface ISidebarProps {
  handleExpandSidebar: () => void;
  expanded: boolean;
  // role: string;
}
const Sidebar = ({ expanded, handleExpandSidebar }: ISidebarProps) => {
  const translate = useTranslations();
  const pathname = usePathname(); // Get the current path
  const { account: user } = useAuthStore();
  const { creator } = useCreatorStore();
  const notification = useNotificationStore();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
  const [menuItems,setMenuItems] = useState<MenuItem[]>([
    { label: translate("Dashboard"), icon: Home, link: "/vendor/dashboard",notification: false },
    {
      label: translate("My_Products"),
      icon: Box,
      link: "/vendor/products",
      notification: false
    },
    {
      label: translate("Channels"),
      icon: Store,
      link: "/vendor/products/channel-products",
      notification: false
    },
    {
      label: translate("Creators"),
      icon: UsersRound,
      link: "/vendor/creators",
      notification: false
    },
    {
      label: translate("Collaboration"),
      icon: UserRound,
      link: "/vendor/creators/collaboration",
      notification: true
    },
    {
      label: translate("Vendor_Analysis"),
      icon: BarChart,
      link: "/vendor/vendor-analysis",
      notification: false
    },
    {
      label: translate("Payment_Earnings"),
      icon: DollarSign,
      link: "/vendor/payment-earnings",
      notification: false
    },
    { label: translate("Settings"), icon: Settings, link: "/vendor/settings", notification: false },
  ]);
  const [creatorMenuItem,setCreatorMenuItem] = useState<MenuItem[]>([
    {
      label: translate("Dashboard"),
      icon: LayoutGrid,
      link: "/creator/dashboard",
      notification: false
    },
    {
      label: translate("My_Store"),
      icon: Store,
      link: `/creator/store/${creator?.store_name}`,
      notification: false
    },
    {
      label: translate("Product_List"),
      icon: Box,
      link: "/creator/product-management",
      notification: false
    },
    {
      label: translate("Collaboration"),
      icon: UserRound,
      link: "/creator/collaboration",
      notification: true
    },
    {
      label: translate("Creator_Analysis"),
      icon: BarChart,
      link: "/creator/creator-analysis",
      notification: false
    },
    {
      label: translate("Payment_Earnings"),
      icon: DollarSign,
      link: "/creator/payment-earnings",
      notification: false
    },
    { label: translate("Settings"), icon: Settings, link: "/creator/settings", notification: false },
  ]);

  const menu = {
    vendor: menuItems,
    creator: creatorMenuItem,
  }[user?.role || "vendor"];

  useEffect(() => {
    if(notification?.creator){
      setCreatorMenuItem((prev) =>
        prev.map((item) =>
          item.label === translate("Collaboration")
            ? { ...item, notification: notification.creator.collaboration }
            : item
        )
      );
    }
    if(notification?.vendor){
      setMenuItems((prev) =>
        prev.map((item) =>
          item.label === translate("Collaboration")
            ? { ...item, notification: notification.vendor.collaboration }
            : item
        )
      );
    }

  },[notification?.creator,notification?.vendor])
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    const prompt = deferredPrompt as any;
    prompt.prompt();

    const choiceResult = await prompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      toastMessage.success("App Installed Successfully.");
    } else {
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

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
        className={`lg:flex hidden relative max-w-[300px] h-screen bg-white flex-col top-0 left-0 z-[9999] transition-all duration-300 ease-in-out shadow-lg  ${
          isSidebarExpanded ? "w-[300px]" : "w-[75px]"
        }`}
      >
        <div className="flex justify-center gap-10  ">
          <div
            className={`p-4 text-primary-color font-bold text-4xl text-center`}
          >
            {!isSidebarExpanded ? (
              <Image
                width={100}
                height={35}
                src="/assets/common/truereff-logo.svg"
                alt="TrueReff"
                className={`h-[35px] mx-auto`}
              />
            ) : (
              <Image
                width={220}
                height={35}
                src="/assets/common/truereff-dark.svg"
                alt="TrueReff"
                className={`w-[225px] h-[35px] mx-auto`}
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
                      item={item}
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
                              childClassName={cn(
                                "text-gray-400 px-2 py-1 cursor-pointer rounded-sm ",
                                pathname === child.link
                                  ? "bg-primary-color text-white"
                                  : "text-gray-500 hover:text-gray-700",
                                pathname !== child.link && "hover:bg-pink-100"
                              )}
                              label={
                                !lg
                                  ? child.label
                                  : isSidebarExpanded
                                  ? child.label
                                  : ""
                              }
                              isChild
                              childIndex={idx}
                              item={item}
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
                    item={item}
                  />
                )
              ) : item.children ? (
                <ToolTipProvider delayDuration={0}>
                  <Tooltip>
                    <Tooltip.Trigger key={idx}>
                      <NavLink
                        key={idx}
                        isActive={item.children.some(
                          (child) => pathname === child.link
                        )}
                        handleToggle={() => toggleMenu(item.label, false)}
                        label={isSidebarExpanded && item.label}
                        Icon={item.icon}
                        item={item}
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
                    <Tooltip.Trigger key={idx}>
                      <NavLink
                        key={idx}
                        handleToggle={() => {
                          handleToggleMenu();
                        }}
                        link={item.link}
                        isActive={pathname === item.link}
                        Icon={item.icon}
                        label={isSidebarExpanded && item.label}
                        handleInstall={handleInstall}
                        item={item}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-white rounded-r-md px-2 py-[9px] text-gray-500 hover:text-gray-700"
                      side="right"
                    >
                      <div className="flex flex-col gap-1 pl-4 ">
                        {item.link === "install-app" ? (
                          <span
                            className={`text-gray-500 hover:text-gray-700 hover:bg-pink-100 px-2 py-1 cursor-pointer rounded-sm`}
                            onClick={() => handleInstall()}
                          >
                            {item?.label}
                          </span>
                        ) : (
                          <Link
                            key={item.link}
                            href={item.link ?? ""}
                            className={cn(
                              "text-gray-400 px-2 py-1 cursor-pointer rounded-sm ",
                              "text-gray-500 hover:text-gray-700 hover:bg-pink-100"
                            )}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    </Tooltip.Content>
                  </Tooltip>
                </ToolTipProvider>
              )}
            </div>
          ))}
          {isVisible && (
            <>
              {isSidebarExpanded ? (
                <NavLink
                  key={"install-app"}
                  handleToggle={() => {
                    handleToggleMenu();
                  }}
                  link={"install-app"}
                  isActive={false}
                  Icon={ArrowDownToLine}
                  label={translate("Install_App")}
                  handleInstall={handleInstall}
                />
              ) : (
                <ToolTipProvider delayDuration={0}>
                  <Tooltip>
                    <Tooltip.Trigger>
                      <NavLink
                        key={"install-app"}
                        handleToggle={() => {
                          handleToggleMenu();
                        }}
                        link={"install-app"}
                        isActive={false}
                        Icon={ArrowDownToLine}
                        label={isSidebarExpanded && translate("Install_App")}
                        handleInstall={handleInstall}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="bg-white rounded-r-md px-2 py-[9px] text-gray-500 hover:text-gray-700"
                      side="right"
                    >
                      <div className="flex flex-col gap-1 pl-4 ">
                        <span
                          className={`text-gray-500 hover:text-gray-700 hover:bg-pink-100 px-2 py-1 cursor-pointer rounded-sm`}
                          onClick={() => handleInstall()}
                        >
                          {translate("Install_App")}
                        </span>
                      </div>
                    </Tooltip.Content>
                  </Tooltip>
                </ToolTipProvider>
              )}
            </>
          )}
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
        className={`max-w-[250px] w-full h-screen bg-white flex flex-col fixed top-0 left-0 lg:hidden z-[9999] transition-transform ${
          expanded ? "-translate-x-full" : "shadow-lg"
        }`}
      >
        <div className="flex justify-end">
          <div className="p-4 text-primary-color font-bold text-4xl text-center">
            <Image
              width={220}
              height={40}
              src="/assets/common/truereff-dark.svg"
              alt="TrueReff"
              className={`w-[225px] h-[35px] mx-auto`}
            />
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
                    handleToggle={() => {
                      handleExpandSidebar();
                      toggleMenu(item.label, false);
                    }}
                    label={item.label}
                    Icon={item.icon}
                    hasSubmenu
                    expended={expandedMenus[item.label]}
                    item={item}
                  />
                  {expandedMenus[item.label] && (
                    <div className="ml-6 px-4">
                      <div className="flex flex-col gap-3 px-4 pt-2">
                        {item.children.map((child, idx) => (
                          <NavLink
                            key={idx}
                            link={child.link}
                            handleToggle={() => {
                              handleExpandSidebar();
                              toggleMenu(item.label, true);
                            }}
                            isActive={pathname === child.link}
                            label={child.label}
                            isChild
                            childIndex={idx}
                            item={item}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  handleToggle={() => {
                    handleExpandSidebar();
                    handleToggleMenu();
                  }}
                  link={item.link}
                  isActive={pathname === item.link}
                  Icon={item.icon}
                  label={item.label}
                  item={item}
                />
              )}
            </div>
          ))}
          {isVisible && (
            <NavLink
              key={"install-app"}
              handleToggle={() => {
                handleToggleMenu();
              }}
              link={"install-app"}
              isActive={false}
              Icon={ArrowDownToLine}
              label={translate("Install_App")}
              handleInstall={handleInstall}
            />
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
