import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/config/authOptions";
import { getProfileAPI } from "@/lib/web-api/user";
import { USER_TYPE } from "@/lib/utils/constants";

interface IAuthenticatedLayout {
  children?: ReactNode;
  redirectPath?: string;
  isPreForm?: boolean;
}

export default async function AuthenticatedLayout({
  children,
  redirectPath = "",
  isPreForm = false,
}: IAuthenticatedLayout) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/register");
  }
  if (session) {
    // const user = await getProfileAPI();
    // if (user?.type === USER_TYPE.Vendor && !user?.vendorId) {
    //   if (!isPreForm) redirect("/pre-form");
    // } else if (user?.type === USER_TYPE.Vendor && user?.vendorId && isPreForm) {
    //   redirect("/dashboard");
    // } else if (user && redirectPath) {
    //   redirect(redirectPath);
    // }
  }
  return <div>{children}</div>;
}
