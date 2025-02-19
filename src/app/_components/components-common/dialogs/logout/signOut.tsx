"use client";
import Button from "@/app/_components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

export default function SignOut() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
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
