"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { translate } from "../../../../../../lib/utils/translate";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
interface IPageName {
  [key: string]: string;
}
interface IHeaderProps {
  handleExpandSidebar: () => void;
}
export default function Header({ handleExpandSidebar }: IHeaderProps) {
  const pathName = usePathname();
  const pageNames: IPageName = {
    "/overview": translate("Overview"),
    "/products/add": translate("Add_New_Product"),
    "/products/list": translate("Product_Catalog"),
    "/products/list/view": translate("View_Product"),
    "/creator": translate("Creator&Collaboration"),
    "/creator/details": translate("Creator_Details"),
    "/campaign/add": translate("Add_New_Campaign"),
    "/campaign": translate("Campaign_List"),
    "/settings": translate("Settings"),
    "/dashboard": translate("Overview"),
    "/my-store/store-setup": translate("Store set-up"),
    "/my-store": translate("Product_List"),
    "/product-management": translate("Product_Management"),
    "/creator_analysis": translate("Creator_Analysis"),
    "/payment-earnings": translate("Payment & Earnings"),
  };
  return (
    <header className="bg-white px-4 py-3 flex items-center">
      <GoSidebarCollapse
        size={20}
        className="cursor-pointer lg:hidden"
        onClick={handleExpandSidebar}
      />
      <h2 className="text-2xl font-medium text-gray-black">
        {pageNames[pathName]}
      </h2>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 bg-background rounded-full"></div>
        <p className="text-gray-black">John Bing</p>
      </div>
      <Link href="?auth=logout" className="mx-4 block">
        <IoLogOutOutline className="text-2xl" />
      </Link>
    </header>
  );
}
