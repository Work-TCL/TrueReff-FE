"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const redirectMap = {
  brand: "/vendor",
  creator: "/",
};

// ✅ Common classes
const wrapperClass = "flex items-center justify-center py-[50px] px-4";
const containerClass = "flex bg-white rounded-full shadow-md overflow-hidden";
const baseTabClass =
  "sm:px-5 px-3 sm:py-4 py-3 transition-all duration-300 font-medium sm:text-xl text-nowrap";
const activeTabClass = "bg-[#FF4E80] text-white";
const inactiveTabClass = "bg-transparent text-black";

const RoleToggleTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname;

  const [activeTab, setActiveTab] = useState(
    currentPath === "/brand" ? "brand" : "creator"
  );

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>
        <button
          onClick={() => {
            router.push(redirectMap.creator);
          }}
          className={`${baseTabClass} ${
            pathname === redirectMap.creator ? activeTabClass : inactiveTabClass
          }`}
        >
          Creator
        </button>
        <button
          onClick={() => {
            router.push(redirectMap.brand);
          }}
          className={`${baseTabClass} ${
            pathname === redirectMap.brand ? activeTabClass : inactiveTabClass
          }`}
        >
          Brand Owner
        </button>
      </div>
    </div>
  );
};

export default RoleToggleTabs;
