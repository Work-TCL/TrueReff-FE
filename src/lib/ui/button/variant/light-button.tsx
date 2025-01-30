import { cn } from "@sohanemon/utils";
import React, { ReactNode } from "react";

export interface ILightButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
  loading?: boolean;
}

export default function LightButton({
  children,
  size = "medium",
  className = "",
  type = "button",
  loading = false,
  ...props
}: ILightButton) {
  return (
    <button
      type={type}
      className={cn(
        "text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
