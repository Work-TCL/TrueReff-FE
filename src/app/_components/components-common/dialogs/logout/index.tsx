"use client";
import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { useSearchParams } from "next/navigation";
import AnchorButton from "@/app/_components/ui/button/variant";
import SignOut from "./signOut";

const LOGOUT = "logout";

export default function Logout() {
  const auth = useSearchParams().get("auth");
  const dialogPath = Boolean(auth === LOGOUT);

  return (
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[638px] w-full overflow-auto"
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto">
        <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-yellow-500">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
          </svg>
        </span>

        <h3 className="mb-2 text-2xl font-bold text-gray-800">Sign out</h3>
        <p className="text-gray-500">
          Are you sure you would like to sign out of your account?
        </p>

        <div className="mt-6 grid grid-cols-2 gap-x-4">
          <AnchorButton
            href="?"
            size="medium"
            className="bg-transparent text-secondary-color"
          >
            Cancel
          </AnchorButton>
          <SignOut />
        </div>
      </div>
    </DialogLayout>
  );
}
