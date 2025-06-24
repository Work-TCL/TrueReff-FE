import DashboardLayout from "@/app/_components/components-common/layout/dashboard";
import BalanceWarningBanner from "../_components/components-common/BalanceWarningBanner";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      {children}
      <BalanceWarningBanner />
    </DashboardLayout>
  );
}
