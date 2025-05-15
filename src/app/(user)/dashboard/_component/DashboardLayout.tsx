"use client";
import React, { useEffect, useState } from "react";
import { getUserApi } from "@/lib/web-api/auth";
import { useAuthStore } from "@/lib/store/auth-user";
import LoadingPage from "@/lib/components/loading-page";
import Header from "@/app/_components/components-common/layout/dashboard/header";
import Sidebar from "./sidebar";
// import { useAuthStore } from "@/lib/store/auth-user";
// import { useRouter } from "next/navigation";

interface IDashboardLayout {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IDashboardLayout) {
  const { status } = useAuthStore();
  // const navigate = useRouter();
  const [expanded, setExpanded] = useState(true);
  const handleExpandSidebar = () => {
    setExpanded((prev) => !prev);
  };
  useEffect(() => {
    getUserApi();
  }, []);
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
