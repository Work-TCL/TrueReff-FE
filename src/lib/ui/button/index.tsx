import { cn } from "@sohanemon/utils";
import React, { ReactNode } from "react";
import { RiLoader3Fill } from "react-icons/ri";

export interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
  loading?: boolean;
}

const Button = ({
  children,
  size = "medium",
  className = "",
  type = "button",
  loading = false,
  ...props
}: IButton) => {
  const baseStyles =
    "tracking-wide font-semibold bg-secondary-color text-white w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none";
  const sizeStyles = size === "large" ? "py-4 px-1 lg:px-5" : "py-3 px-3";

  return (
    <button
      type={type}
      className={cn(baseStyles, sizeStyles, className)}
      {...props}
    >
      {loading ? (
        <RiLoader3Fill className="animate-spin duration-300 text-xl" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
