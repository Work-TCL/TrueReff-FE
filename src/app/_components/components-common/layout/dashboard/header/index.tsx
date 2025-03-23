"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { translate } from "../../../../../../lib/utils/translate";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
interface IPageName {
  [key: string]: string;
}
interface IHeaderProps {
  handleExpandSidebar: () => void;
}
export default function Header({ handleExpandSidebar }: IHeaderProps) {
  const pathName = usePathname();
  const { data: session } = useSession();
  const pageNames: IPageName = {
    "/vendor/dashboard": translate("Overview"),
    "/vendor/products/add": translate("Add_New_Product"),
    "/vendor/products/list": translate("Product_Catalog"),
    "/vendor/products/list/view": translate("View_Product"),
    "/vendor/creator": translate("Creators"),
    "/vendor/creator/details": translate("Creator_Details"),
    "/vendor/campaign/add": translate("Add_New_Campaign"),
    "/vendor/campaign": translate("Campaign_List"),
    "/vendor/settings": translate("Settings"),
    "/creator/dashboard": translate("Overview"),
    "/creator/my-store/store-setup": translate("Store_set_up"),
    "/creator/my-store": translate("Product_List"),
    "/creator/product-management": translate("Product_Management"),
    "/creator/creator_analysis": translate("Creator_Analysis"),
    "/creator/payment-earnings": translate("Payment_Earnings"),
    "/creator/brandsList": translate("Brands_List"),
  };

  return (
    <header className="bg-white px-3 py-3 flex items-center gap-1">
      <Menu
        className="size-5 shrink-0 cursor-pointer lg:hidden"
        onClick={handleExpandSidebar}
      />
      <h2 className="text-2xl font-medium text-gray-black">
        {pageNames[pathName]}
      </h2>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 bg-background rounded-full"></div>
        <p className="text-gray-black">{session?.user?.name}</p>
      </div>
      <Link href="?auth=logout" className="mx-4 block">
        <IoLogOutOutline className="text-2xl" />
      </Link>
    </header>
  );
}
