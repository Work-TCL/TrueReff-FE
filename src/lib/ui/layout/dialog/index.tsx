"use client";
import Link from "next/link";
import React, { Fragment, ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface IDialogLayout {
  children: ReactNode;
  open: boolean;
  skipClose?: boolean;
  size?: string;
  handleClose?: () => void;
  isCustomDesign?: boolean;
  title?: string;
}

export default function DialogLayout({
  children,
  open,
  size,
  skipClose,
  title = "",
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
          <div className="flex h-full items-center justify-center text-center sm:items-center sm:py-0 cursor-pointer relative">
            <Link
              href="?"
              className="block fixed inset-0 bg-black bg-opacity-60 transition-opacity z-1 lg:backdrop-blur-none backdrop-blur-sm"
              aria-hidden="true"
            ></Link>

            <div
              className={`bg-white relative rounded-lg text-left transition-all w-fit h-fit max-h-[90vh] overflow-hidden flex flex-col`}
            >
              {title || !skipClose ? (
                <div className="flex items-center justify-between px-4 sm:px-10 pt-6 sm:pt-6  ">
                  {title && (
                    <h3 className="text-xl text-gray-black font-medium flex-1 truncate">
                      {title}
                    </h3>
                  )}
                  {skipClose ? null : (
                    <Link href="?">
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
