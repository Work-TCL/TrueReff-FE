"use client";
import React from 'react';
import { usePathname } from 'next/navigation'
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
interface IPageName {
  [key: string]: string;
}
interface IHeaderProps {
  handleExpandSidebar: () => void;
}
export default function Header({handleExpandSidebar}: IHeaderProps) {
  const pathName = usePathname();
  const pageNames: IPageName = {
    "/dashboard": "Overview",
    "/products/add": "Add New Product",
    "/products/list": "Product Catalog",
    "/products/list/view": "View Product",
    "/creator": "Creator & Collaboration",
    "/creator/details": "Creator Details",
    "/campaign/add": "Add New Campaign",
    "/campaign": "Campaign List",
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
