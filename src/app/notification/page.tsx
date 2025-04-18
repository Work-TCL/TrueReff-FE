import { Suspense } from "react";
import Loader from "@/app/_components/components-common/layout/loader";
import Notification from "@/app/_components/pages/notifications/notification";
import Header from "../_components/components-common/layout/dashboard/header";
import { Sidebar } from "lucide-react";
import DashboardLayout from "../_components/components-common/layout/dashboard";

export default function NotificationMain() {
  return (
    <DashboardLayout>
      <Notification />
    </DashboardLayout>
  );
}
