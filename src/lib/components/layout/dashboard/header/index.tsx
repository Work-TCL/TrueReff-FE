"use client";
import React from 'react';
import { usePathname } from 'next/navigation'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import {translate} from "../../../../utils/translate";
interface IPageName {
  [key: string]: string;
}
interface IHeaderProps {
  handleExpandSidebar: () => void;
}
export default function Header({handleExpandSidebar}: IHeaderProps) {
  const pathName = usePathname();
  const pageNames: IPageName = {
    "/dashboard": translate("Overview"),
    "/products/add": translate("Add New Product"),
    "/products/list": translate("Product Catalog"),
    "/products/list/view": translate("View Product"),
    "/creator": translate("Creator & Collaboration"),
    "/creator/details": translate("Creator Details"),
    "/campaign/add": translate("Add New Campaign"),
    "/campaign": translate("Campaign List"),
    "/settings": translate("Settings"),
  };
  return (
    <header className="bg-white px-4 py-3 flex items-center">
      <GoSidebarCollapse size={20} className="cursor-pointer lg:hidden" onClick={handleExpandSidebar}/>
      <h2 className="text-2xl font-medium text-gray-black">{pageNames[pathName]}</h2>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 bg-background rounded-full"></div>
        <p className="text-gray-black">John Bing</p>
      </div>
    </header>
  );
}
