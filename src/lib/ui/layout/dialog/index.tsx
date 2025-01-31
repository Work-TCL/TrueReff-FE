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
}

export default function DialogLayout({
  children,
  open,
  size,
  skipClose,
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
        <div className="fixed inset-0 z-[23] sm:w-screen h-screen overflow-hidden">
          <div className="flex min-h-full items-center justify-center text-center sm:items-center sm:py-0 cursor-pointer relative">
            <Link
              href="?"
              className="block fixed inset-0 bg-black bg-opacity-60 transition-opacity z-1 lg:backdrop-blur-none backdrop-blur-sm"
              aria-hidden="true"
            ></Link>

            <div
              className={`max-h-[90vh] pb-10 rounded-lg overflow-hidden ${
                props.isCustomDesign ? "max-w-screen-xl" : "sm:max-w-[90vh]"
              }`}
            >
              {skipClose ? null : (
                <div className="flex justify-end sticky top-0 pb-1">
                  <Link href="?">
                    <IoClose
                      fontSize={25}
                      color="#ffffff"
                      className="text-white"
                    />
                  </Link>
                </div>
              )}
              <div
                className={`bg-white relative rounded-lg text-left transition-all ${
                  props.isCustomDesign ? "max-h-[90vh] " : "h-full"
                }${size ? size : "w-fit"}`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  );
}
