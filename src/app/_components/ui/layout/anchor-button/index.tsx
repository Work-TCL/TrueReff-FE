import { cn } from "@sohanemon/utils";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

export interface IButton extends Omit<LinkProps, "href"> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
  href?: string;
}

const ButtonAnchor = ({
  children,
  size = "medium",
  href = "#",
  className = "",
  ...props
}: IButton) => {
  const baseStyles =
    "flex items-center justify-center bg-primary text-black font-medium border-none cursor-pointer transition-colors font-normal duration-300 ease-in-out";
  const sizeStyles =
    size === "large"
      ? "py-3 px-5 text-base rounded-md"
      : "py-2 px-3 text-xs rounded";

  <Link
    href={href}
    className={cn(baseStyles, sizeStyles, className)}
    {...props}
  >
    {children}
  </Link>;
};

export default ButtonAnchor;
