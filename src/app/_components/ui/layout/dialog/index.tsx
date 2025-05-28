"use client";
import { cn } from "@/lib/utils/commonUtils";
import Link from "next/link";
import React, { Fragment, ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface IDialogLayout {
  children: ReactNode;
  open: boolean;
  skipClose?: boolean;
  size?: string;
  onClose?: () => void;
  isCustomDesign?: boolean;
  title?: string;
  titleClassName?: string;
  className?: string;
}

export default function DialogLayout({
  children,
  open,
  size = "",
  skipClose,
  onClose = undefined,
  title = "",
  titleClassName,
  className,
  ...props
}: IDialogLayout) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    open && (
      <Fragment>
        <div className="fixed inset-0 z-[40] sm:w-screen h-screen overflow-hidden">
          <div className={cn(`flex h-full items-center cursor-pointer justify-center text-center sm:items-center sm:py-0 relative`,className)}>
            {onClose ? (
              <div
                onClick={() => onClose()}
                className="block fixed inset-0 bg-black bg-opacity-60 transition-opacity z-1 lg:backdrop-blur-none backdrop-blur-sm"
                aria-hidden="true"
              ></div>
            ) : (<>
              {skipClose ? <div
                className="block fixed inset-0 bg-black bg-opacity-60 transition-opacity z-1 lg:backdrop-blur-none backdrop-blur-sm"
                aria-hidden="true"
              ></div> :<Link
                href="?"
                className="block fixed inset-0 bg-black bg-opacity-60 transition-opacity z-1 lg:backdrop-blur-none backdrop-blur-sm"
                aria-hidden="true"
              ></Link>}</>
            )}

            <div
              className={cn(
                `bg-white relative rounded-lg text-left transition-all w-fit h-fit max-h-[90vh] overflow-hidden flex flex-col`,
                size
              )}
            >
              {title || !skipClose ? (
                <div
                  className={cn(
                    "flex items-center justify-between px-4 pb-3 pt-2 mt-2 m-0 mb-1",
                    titleClassName
                  )}
                >
                  {title && (
                    <h3 className="text-md text-gray-black font-medium flex-1 truncate">
                      {title}
                    </h3>
                  )}
                  {skipClose ? null : onClose ? (
                    <div onClick={() => onClose()} className="block ml-auto cursor-pointer">
                      <IoClose
                        fontSize={25}
                        color="#000"
                        className="text-white"
                      />
                    </div>
                  ) : (
                    <Link href="?" className="block ml-auto">
                      <IoClose
                        fontSize={25}
                        color="#000"
                        className="text-white"
                      />
                    </Link>
                  )}
                </div>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </Fragment>
    )
  );
}
