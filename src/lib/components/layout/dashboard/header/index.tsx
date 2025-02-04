"use client";
import React from 'react';
import { usePathname } from 'next/navigation'
interface IPageName {
  [key: string]: string;
}
export default function Header() {
  const pathName = usePathname();
  const pageNames: IPageName = {
    "/dashboard": "Overview",
    "/product/add": "Add New Product",
    "/product/list": "Product Catalog",
    "/product/list/view": "View Product",
    "/creator": "Creator & Collaboration",
    "/creator/details": "Creator Details",
    "/campaign/add": "Add New Campaign",
    "/campaign/list": "Campaign List",
  }
  return (
    <header className="bg-white px-4 py-3 flex items-center">
      <h2 className="text-2xl font-medium text-gray-black">{pageNames[pathName]}</h2>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 bg-background rounded-full"></div>
        <p className="text-gray-black">John Bing</p>
      </div>
    </header>
  )
}
