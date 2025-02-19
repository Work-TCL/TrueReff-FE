import React from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import EditVendorForm from "./vendor-edit";

const key = "profile";

export default function EditProfile({ profile, editKey = "" }: any) {
  const dialogPath = editKey === key;
  return (
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[638px] w-full overflow-auto"
      title="Edit Profile"
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full sm:w-[300px] md:w-[500px] text-center overflow-y-auto">
        <EditVendorForm profile={profile} />
      </div>
    </DialogLayout>
  );
}
