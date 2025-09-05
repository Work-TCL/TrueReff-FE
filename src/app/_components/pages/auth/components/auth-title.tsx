import { cn } from "@sohanemon/utils";
import React from "react";

interface IAuthTitle {
  text: string;
  className?: string;
}

export default function AuthTitle({ text, className = "" }: IAuthTitle) {
  return (
    <div
      className={cn("text-[32px] md:text-start text-center font-semibold text-gray-darken", className)}
    >
      {text}
    </div>
  );
}
