import {
  BarChart,
  Box,
  DollarSign,
  Home,
  LifeBuoy,
  Megaphone,
  Settings,
  User,
} from "lucide-react";

export const MENU = {
  "/dashboard": { label: "Overview", icon: Home, link: "/dashboard" },
  "/product": {
    label: "Product_Catalog",
    icon: Box,
    children: [
      { label: "Add_New_Product", link: "/product/add" },
      { label: "Product_List", link: "/product" },
    ],
  },
  "/creator": {
    label: "Creator&Collaboration",
    icon: User,
    link: "/creator",
  },
  "/campaign": {
    label: "Campaign",
    icon: Megaphone,
    children: [
      { label: "Add_New_Campaign", link: "/campaign/add" },
      { label: "List of campaigns", link: "/campaign" },
    ],
  },
  "/bids": { label: "Bids", icon: BarChart, link: "/bids" },
  "/brand-analysis": {
    label: "Brand_Analysis",
    icon: BarChart,
    link: "/brand-analysis",
  },
  "/recharge": {
    label: "Account_Recharge",
    icon: DollarSign,
    link: "/recharge",
  },
  "/payments": { label: "Payments", icon: DollarSign, link: "/payments" },
  "/support": { label: "Support", icon: LifeBuoy, link: "/support" },
  "/settings": { label: "Settings", icon: Settings, link: "/settings" },
  "/logout": { label: "Logout", icon: Settings, link: "?auth=logout" },
};

export const USER_TYPE = {
  USER: "user",
  Vendor: "vendor",
  Creator: "creator",
};

export type COLLABORATION_STATUS_TYPE =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "REQUESTED"
  | "EXPIRED";

export const COLLOBRATION_STATUS = {
  REQUESTED: "REQUESTED",
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
};

export const badgeColor: { [key: string]: string } = {
  LIVE: "bg-[#098228] text-[#098228]",
  REQUESTED: "bg-[#FF9500] text-[#FF9500]",
  EXPIRED: "bg-[#FF3B30] text-[#FF3B30]",
  REJECTED: "bg-[#FF3B30] text-[#FF3B30]",
  PENDING: "bg-[#5856D6] text-[#5856D6]",
};
export const statusMessage: { [key: string]: string } = {
  "REQUESTED": "Request Sent",
  "PENDING": "Collaboration Pending",
  "REJECTED": "Request Rejected",
  "LIVE": "Collaboration Live",
  "EXPIRED": "Collaboration Expired",
  "REQUESTED_CREATOR_TO_VENDOR": "Creator requested to you",
  "REQUESTED_VENDOR_TO_CREATOR": "You requested to creator",
  "REQUESTED_CREATOR_FROM_VENDOR": "You requested to vendor",
  "REQUESTED_VENDOR_FROM_CREATOR": "Vendor requested to you",
}
export function formatNumber(num: number = 0) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num === 0 ? "" : num.toString();
}
