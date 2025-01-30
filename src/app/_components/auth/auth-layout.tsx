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
    <div className="h-screen text-gray-900 grid grid-cols-2 overflow-hidden">
      <div
        className="h-full w-full text-center bg-black bg-contain bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url('/assets/auth/${authImage}')` }}
      />
      <div className="sm:p-12 overflow-auto">{children}</div>
    </div>
  );
}
