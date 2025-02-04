import AuthenticatedLayout from "@/lib/components/authenticated-layout";
import DashboardLayout from "@/lib/components/layout/dashboard";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthenticatedLayout><DashboardLayout>{children}</DashboardLayout></AuthenticatedLayout>;
}