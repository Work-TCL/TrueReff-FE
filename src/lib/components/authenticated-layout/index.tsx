import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/config/authOptions";

interface IAuthenticatedLayout {
    children?: ReactNode;
    redirectPath?: string;
}

export default async function AuthenticatedLayout({ children, redirectPath = '' }: IAuthenticatedLayout) {
    const session = await getServerSession(authOptions);

    // if (!session) {
    //     redirect("/register");
    // } 
     if (redirectPath) {
        redirect(redirectPath);
    }

    return <div>{children}</div>;
}