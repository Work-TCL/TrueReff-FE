"use client";
import Button from "@/app/_components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SignOut() {
  const nevigate = useRouter();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
    nevigate.push("/login");
  };
  return (
    <Button
      onClick={handleLogout}
      size="medium"
      className="px-6 text-sm"
      type="submit"
    >
      Submit
    </Button>
  );
}
