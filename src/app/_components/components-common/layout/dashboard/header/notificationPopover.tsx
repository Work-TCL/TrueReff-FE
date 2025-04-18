"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { translate } from "@/lib/utils/translate";
import { cn } from "@sohanemon/utils";
import { BellRing, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationPopoverProps {
  notifications: Notification[];
  unreadNotifications: number;
  fetchNotifications: () => void;
  readNotifications: (id: string | null, markAll?: boolean) => void;
  formatTimeAgo: (date: string) => string;
}

export default function NotificationPopover({
  notifications,
  unreadNotifications,
  fetchNotifications,
  readNotifications,
  formatTimeAgo,
}: NotificationPopoverProps) {
  const [open, setOpen] = useState(false);
  const translate = useTranslations();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <BellRing className="cursor-pointer md:w-6 md:h-6 h-5 w-5 font-normal text-primary" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white md:text-[10px] text-[12px] font-bold px-1 py-0 rounded-full">
              {unreadNotifications}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="absolute z-40 md:right-0  right-[-105px] mt-2 flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 sm:w-[361px] lg:right-0">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div
            className="flex items-center justify-center size-6"
            onClick={() => setOpen(false)}
          >
            <CircleX className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-800" />
          </div>
        </div>

        <div
          className={cn(
            "mt-3 space-y-3 max-h-[357px] overflow-y-auto pr-2",
            notifications.length === 0 &&
              "h-full flex justify-center items-center"
          )}
        >
          {notifications.length === 0 ? (
            <p className="text-center text-lg text-gray-500">
              No notifications
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start  border-b gap-3 cursor-pointer p-2
                ${!notification.read ? "font-semibold" : "font-normal"}
                `}
                onClick={() =>
                  !notification.read && readNotifications(notification._id)
                }
              >
                <div>
                  <p className="text-sm text-gray-800 font-semibold">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="mt-4 p-2 w-full absolute bottom-0 left-0">
            <Button
              className="text-gray-600 bg-gray-100 px-3 py-1 md:text-sm text-xs rounded-md md:h-10 h-7 w-full"
              onClick={() => router.push("/notification")}
            >
              {translate("View All Notifications")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
