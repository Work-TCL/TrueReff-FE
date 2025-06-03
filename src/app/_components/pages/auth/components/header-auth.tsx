"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface IHeaderAuthProps {
  redirectUrl?: string;
}
export default function HeaderAuth({ redirectUrl }: IHeaderAuthProps) {
  const router = useRouter();
  return (
    <div className="flex justify-center mb-3">
      <Image
        onClick={() => redirectUrl && router.push(redirectUrl)}
        width={30}
        height={30}
        src="/assets/common/truereff-dark.svg"
        alt="TrueReff"
        className={`md:w-auto md:max-w-[233px] w-auto max-w-[200px]  mx-auto ${
          redirectUrl ? "cursor-pointer" : ""
        }`}
      />
    </div>
  );
}
