"use client";

import socketService from "@/lib/services/socket-service";
import { useCreatorStore } from "@/lib/store/creator";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import { Info, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface INotification {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

function formatTimeAgo(date: string) {
  const now: any = new Date();
  const past: any = new Date(date);
  const diffMs = now - past; // Difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000); // Convert to seconds
  const diffMin = Math.floor(diffSec / 60); // Convert to minutes
  const diffHours = Math.floor(diffMin / 60); // Convert to hours

  if (diffMin < 1) {
    return "Just now";
  } else if (diffMin < 60) {
    return `${diffMin} minutes ago`;
  } else if (diffHours < 2) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return past
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""); // Show full date & time after 2 hours
  }
}
export default function Notification() {
  const translate = useTranslations();
  const { vendor } = useVendorStore();
  const { creator } = useCreatorStore();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState<number>(1);
  const pageLimit: number = 10;
  const pathName = usePathname();
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadingRef, hasMore, isLoading]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/message/notification/list?limit=${pageLimit}&page=${page}`
      );
      if (response?.status === 200) {
        const notificationRes: any = response?.data;

        setNotifications((prev) => {
         let data = page === 1
            ? [...notificationRes?.data]
            : [...prev, ...notificationRes?.data]
            setHasMore(data?.length < notificationRes?.total);
            return data;
      });
      } else {
        setNotifications([]);
      }
    } catch (error: any) {
      // toast.error(error?.message || "Notifications Fetch Failed.");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pathName === "/notification") {
      fetchNotifications();
    }
  }, [page]);

  useEffect(() => {
    socketService.connect();
    if (creator.creatorId || vendor.vendorId) {
      let id: any = creator.creatorId || vendor.vendorId;
      id && socketService.registerUser(String(id));
    }

    socketService.onNotification((data) => {
      if (data?.message) {
        fetchNotifications();
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const readNotifications = async (
    notificationId: string | null,
    isReadAll: boolean = false
  ) => {
    try {
      let payload = isReadAll ? { readAll: true } : { notificationId };
      const response = await axios.put(
        `/message/notification/mark-read`,
        payload
      );
      if (response.status === 200) {
        const notification: INotification = response?.data?.data;
        let index = notification
          ? notifications.findIndex((ele) => ele?._id === notification?._id)
          : -1;
        if (index !== -1) {
          notifications[index] = notification; // Replace object at found index
          setNotifications([...notifications]);
        }
        if (response?.data?.message === "All notifications marked as read") {
          const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            read: true,
          }));
          setNotifications([...updatedNotifications]);
        }
      }
    } catch (error: any) {
      setNotifications([]);
      toast.error(error?.message || "Notifications Fetch Failed.");
    } finally {
    }
  };

  return (
    <div className="flex flex-col md:p-4 p-2 md:gap-6 gap-4 h-full">
      <div className="p-2 md:p-4 bg-white rounded-[20px] h-full">
        {!isLoading && notifications.length === 0 ? (
          <EmptyPlaceHolder />
        ) : (
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <div className="p-2 overflow-x-hidden overflow-y-auto h-[calc(100vh-160px)] md:h-[calc(100vh-160px)] flex flex-col gap-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md ${
                    !notification.read ? "font-semibold" : "font-normal"
                  }`}
                  onClick={() =>
                    !notification.read && readNotifications(notification._id)
                  }
                >
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              ))}
              {hasMore && (
                <div
                  className="flex justify-center py-2 text-gray-400"
                  ref={loadingRef}
                >
                  <LoaderCircle
                    className="animate-spin"
                    color="#ff4979"
                    size={40}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export function EmptyPlaceHolder() {
  const translate = useTranslations();
  return (
    <div className="flex items-center justify-center flex-col flex-1 col-span-full text-center h-full text-gray-500 p-4 bg-white ">
      <Info className="mx-auto mb-2 text-gray-400" />
      <h2 className="text-lg font-semibold">{translate("No_Notifications")}</h2>
      <p className="text-sm">
        {translate("No_Notifications_Description")}
      </p>
    </div>
  );
}
