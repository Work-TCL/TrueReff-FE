import AuthenticatedLayout from "@/app/_components/components-common/authenticated-layout";
import DashboardLayout from "@/app/_components/components-common/layout/dashboard";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedLayout><DashboardLayout>{children}</DashboardLayout></AuthenticatedLayout>;
}