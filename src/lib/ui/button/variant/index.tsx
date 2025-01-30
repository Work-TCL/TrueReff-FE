import { cn } from "@sohanemon/utils";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

export interface IButton extends Omit<LinkProps, "href"> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
  href: string;
}

const AnchorButton = ({
  children,
  size = "medium",
  href,
  className = "",
  ...props
}: IButton) => {
  const baseStyles =
    "flex items-center justify-center bg-primary text-black font-medium cursor-pointer transition-colors font-normal duration-300 ease-in-out hover:bg-transparent border border-transparent hover:border-primary hover:text-primary";
  const sizeStyles =
    size === "large"
      ? "py-3 px-1 lg:px-5 font-normal text-xs lg:text-base rounded-md"
      : size === "medium"
      ? "py-2 px-9 font-normal rounded-md"
      : "py-3 px-3 text-xs rounded";

  return (
    <Link href={href} legacyBehavior>
      <a className={cn(baseStyles, sizeStyles, className)} {...props}>
        {children}
      </a>
    </Link>
  );
};

export default AnchorButton;
