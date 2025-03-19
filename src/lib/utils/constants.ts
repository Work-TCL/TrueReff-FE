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
