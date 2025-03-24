import { cn } from "@sohanemon/utils";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

export interface IButton extends Omit<LinkProps, "href"> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
  href: string;
  loading?: boolean;
}

const AnchorButton = ({
  children,
  size = "medium",
  loading = false,
  href,
  className = "",
  ...props
}: IButton) => {
  const baseStyles =
    "border border-secondary-color tracking-wide font-medium bg-secondary-color text-white w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none";
  const sizeStyles = size === "large" ? "py-4 px-1 lg:px-5" : "py-3 px-3";

  return (
    <Link href={href} legacyBehavior>
      <a className={cn(baseStyles, sizeStyles, className)} {...props}>
        {loading ? "loading..." : children}
      </a>
    </Link>
  );
};

export default AnchorButton;
