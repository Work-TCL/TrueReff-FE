"use client";
import Sidebar from "@/app/_components/components-common/layout/dashboard/sidebar";
import React, { useState } from "react";
import Header from "./header";
import { useSession } from "next-auth/react";
import LoadingPage from "@/lib/components/loading-page";

interface IDashboardLayout {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IDashboardLayout) {
  const { status } = useSession();
  const [expanded, setExpanded] = useState(true);
  const handleExpandSidebar = () => {
    setExpanded((prev) => !prev);
  };
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
