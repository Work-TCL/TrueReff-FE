"use client";
import Sidebar from "@/app/_components/components-common/layout/dashboard/sidebar";
import React, { useEffect, useState } from "react";
import Header from "./header";
import { getUserApi } from "@/lib/web-api/auth";
import { useAuthStore } from "@/lib/store/auth-user";
import LoadingPage from "@/lib/components/loading-page";
import { usePathname } from "next/navigation";
// import { useAuthStore } from "@/lib/store/auth-user";
// import { useRouter } from "next/navigation";

interface IDashboardLayout {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IDashboardLayout) {
  const { status } = useAuthStore();
  const pathName = usePathname();
  const [expanded, setExpanded] = useState(true);
  const handleExpandSidebar = () => {
    setExpanded((prev) => !prev);
  };
  useEffect(() => {
    getUserApi();
  }, []);
  useEffect(()=> {
    handleExpandSidebar();
  },[pathName]);
  // if (status === "unauthenticated") {
  //   return navigate?.push("/login");
  // }
  if (status === "loading") {
    return <LoadingPage />;
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar handleExpandSidebar={handleExpandSidebar} expanded={expanded} />
      <main className="flex-1 w-full h-full overflow-hidden flex flex-col">
        <Header handleExpandSidebar={handleExpandSidebar} />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
