import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@/lib/config/authOptions";

interface IAuthenticatedLayout {
    children: ReactNode;
}

export default async function AuthenticatedLayout({ children }: IAuthenticatedLayout) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/?auth=signup");
    }

    return <div>{children}</div>;
}