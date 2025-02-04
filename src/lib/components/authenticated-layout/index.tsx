import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/config/authOptions";

interface IAuthenticatedLayout {
    children?: ReactNode;
    redirectPath?: string;
}

export default async function AuthenticatedLayout({ children, redirectPath = '/dashboard' }: IAuthenticatedLayout) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/register");
    } 
    // else if (redirectPath && session) {
    //     redirect(redirectPath);
    // }

    return <div>{children}</div>;
}