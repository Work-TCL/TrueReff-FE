"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { translate } from "../../../../../../lib/utils/translate";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { Bell, BellRing, Calendar, Mail, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
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
    "/vendor/products": translate("Product_Lists"),
    "/vendor/products/view": translate("View_Product"),
    "/vendor/products/channels": translate("Channels"),
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
  const notifications = [
    {
      id: 1,
      icon: <Bell className="w-5 h-5 text-blue-500" />,
      message: "Your call has been confirmed",
      time: "5 minutes ago",
    },
    {
      id: 2,
      icon: <Mail className="w-5 h-5 text-blue-500" />,
      message: "You have a new message",
      time: "1 minute ago",
    },
    {
      id: 3,
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      message: "Your subscription is expiring soon",
      time: "2 hours ago",
    },
  ];

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
        <Drawer
          //  =====> Add direction  
          direction="right"
        >
          <div className="relative">
            <DrawerTrigger asChild>
              <BellRing className="cursor-pointer w-8 h-8" />
            </DrawerTrigger>

            {/* Notification Count */}
            {notifications?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded-full">
                {notifications?.length}
              </span>
            )}
          </div>

          <DrawerContent
            // =======>  Edit drawer className 
            className="  left-auto  right-4 top-2 bottom-2 fixed z-50  outline-none w-[310px] flex  bg-transparent border-none mt-0 "
          >
            {/* =====> Edit DrawerContent first child className  */}
            <div className="bg-zinc-50 h-full w-full grow p-2 flex flex-col rounded-[16px]">
              <DrawerHeader>
                <DrawerTitle>
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <DrawerClose asChild>
                      <X className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-800" />
                    </DrawerClose>
                  </div>
                  </DrawerTitle>
                <DrawerDescription><p className="text-sm text-gray-500 mt-2">You have {notifications.length} unread messages.</p></DrawerDescription>
              </DrawerHeader>
              <div className="mt-3 m-3 space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3">
                    {notification.icon}
                    <div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        <div className="w-8 h-8 bg-background rounded-full"></div>
        <p className="text-gray-black">{session?.user?.name}</p>
      </div>
      <Link href="?auth=logout" className="mx-4 block">
        <IoLogOutOutline className="text-2xl" />
      </Link>
    </header>
  );
}
