"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface IHeaderAuthProps {
  redirectUrl?: string;
}
export default function HeaderAuth({redirectUrl}:IHeaderAuthProps) {
  const router = useRouter();
  return (
    <div className="flex justify-center">
      <Image onClick={()=> redirectUrl && router.push(redirectUrl)} width={40} height={40} src="/assets/landing/logo_TrueReff.svg" alt="TrueReff" className={`md:w-auto mx-auto ${redirectUrl ? "cursor-pointer":""}`}/>
    </div>
  );
}
