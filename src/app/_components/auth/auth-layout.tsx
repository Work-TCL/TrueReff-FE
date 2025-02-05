import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  authImage?: string;
}

export default function AuthLayoutPage({
  children,
  authImage = "login-image.svg",
}: IProps) {
  return (
    <div className="h-screen text-gray-900 grid lg:grid-cols-2 grid-cols-1 overflow-hidden">
      <div
        className="h-full w-full text-center bg-black bg-center bg-no-repeat bg-cover lg:block hidden"
        style={{ backgroundImage: `url('/assets/auth/${authImage}')` }}
      />
      <div className="sm:p-12 p-4 overflow-auto my-auto bg-white h-full">
        {children}
      </div>
    </div>
  );
}
