"use client";
import React from 'react';
import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';
import { toast } from "react-hot-toast";


const baseClasses =
  "flex items-center gap-3 rounded-lg p-4 shadow-lg border transition-all duration-300 w-[280px]";
export const toastMessage = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast(
        (t: any) => (
            <span className="text-[#7877EE]">
                {message}
            </span>
        ),
        {
            icon: <Info strokeWidth={1.5} color="#7877EE" />,
        }
    ),
    warning: (message: string) => toast(
        (t: any) => (
            <span className="text-[#FFE982]">
                {message}
            </span>
        ),
        {
            icon: <TriangleAlert strokeWidth={1.5} color="#FFE982" />,
        }
    ),
    /**
   * Custom Toast with styled layout
   * @param message - ReactNode (text or JSX)
   * @param type - "success" | "error" | "info" | "warning"
   * @param onClick - callback when toast is clicked
   */
  custom: (
  message: React.ReactNode,
  type: "success" | "error" | "info" | "warning" = "success",
  onClick?: () => void
) =>
  toast.custom((t: any) => {
    const typeStyles: Record<string, any> = {
      success: {
        icon: <CheckCircle2 className="text-green-500 shrink-0" strokeWidth={1.5} />,
        bg: "bg-white border-green-200",
        text: "text-gray-800",
      },
      error: {
        icon: <XCircle className="text-red-500 shrink-0" strokeWidth={1.5} />,
        bg: "bg-white border-red-200",
        text: "text-gray-800",
      },
      info: {
        icon: <Info className="text-blue-500 shrink-0" strokeWidth={1.5} />,
        bg: "bg-white border-blue-200",
        text: "text-gray-800",
      },
      warning: {
        icon: <TriangleAlert className="text-yellow-500 shrink-0" strokeWidth={1.5} />,
        bg: "bg-white border-yellow-200",
        text: "text-gray-800",
      },
    };

    const current = typeStyles[type];

    return (
      <div
        onClick={() => {
          toast.dismiss(t.id);
          onClick?.();
        }}
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } ${current.bg} ${current.text} rounded-lg shadow-lg p-4 flex items-start gap-3 cursor-pointer max-w-sm sm:max-w-md`}
        style={{ wordBreak: "break-word", whiteSpace: "normal" }}
      >
        {current.icon}
        <p className="font-normal text-gray-600 leading-snug break-words">{message}</p>
      </div>
    );
  }),

}