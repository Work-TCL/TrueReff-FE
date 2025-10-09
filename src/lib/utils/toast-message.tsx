"use client";
import React from 'react';
import { Info, TriangleAlert } from 'lucide-react';
import { toast } from "react-hot-toast";


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
    custom: (message: React.ReactNode, onClick: () => void) => toast.custom((t: any) => (
      <div
        onClick={() => {
          toast.dismiss(t.id); // close toast
          onClick(); // call the onClick function
        }}
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } bg-white shadow-lg rounded-lg p-4 cursor-pointer border border-gray-200`}
      >
        <p className="text-gray-800 font-medium">
          {message}
        </p>
      </div>
    ))

}