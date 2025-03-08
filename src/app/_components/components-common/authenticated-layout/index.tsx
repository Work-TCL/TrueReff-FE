import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/config/authOptions";
import { getProfileAPI } from "@/lib/web-api/user";
import { USER_TYPE } from "@/lib/utils/constants";

interface IAuthenticatedLayout {
  children?: ReactNode | any;
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
    try {
      const user = await getProfileAPI();
      console.log(
        "user",
        user?.type === USER_TYPE.Vendor && !user?.vendorId && !isPreForm
      );

      if (user?.type === USER_TYPE.Vendor && !user?.vendorId && !isPreForm) {
        redirect("/pre-form");
      } else if (
        user?.type === USER_TYPE.Vendor &&
        user?.vendorId &&
        isPreForm
      ) {
        redirect("/dashboard");
      } else if (user && redirectPath) {
        redirect(redirectPath);
      } else if (getUser && user) {
        <div>{children(user)}</div>;
      }
    } catch (e) {
      console.log("errror whille get profile", e);
    }
  }
  return <div>{children}</div>;
}
