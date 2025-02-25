import Button from "@/app/_components/ui/button";
import React from "react";
import { translate } from "../../../../lib/utils/translate";
import EditProfile from "@/app/_components/components-common/dialogs/edit-profile";
import Link from "next/link";

export default function Profile({ profile, editKey }: any) {
  return (
    <div className="flex flex-col w-full lg:w-1/2 bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <h2 className="text-sm xl:text-lg font-semibold">
          {translate("Personal_Information")}
        </h2>
        <Link href="?edit=profile" className="text-sm text-primary">
          {translate("edit_profile")}
        </Link>
      </div>
      <div className="flex gap-3 xl:gap-4">
        <div className="flex flex-col gap-2 text-[14px] xl:text-[16px] text-gray-500">
          <span>{translate("Name")}:</span>
          <span>{translate("Email")}:</span>
          <span>{translate("Mobile")}:</span>
        </div>
        <div className="flex flex-col text-[14px] xl:text-[16px] gap-2">
          <span className="font-medium">{profile?.name || "-"}</span>
          <span className="font-medium">{profile?.email || "-"}</span>
          <span className="font-medium">{profile?.phone || "-"}</span>
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mt-6">
        <h2 className="text-sm xl:text-lg font-semibold">
          {translate("saved_address")}
        </h2>
        <button className="text-sm text-primary">
          + {translate("add_new_address")}
        </button>
      </div>
      <div className="flex flex-col w-full xl:w-2/3  border border-gray-300 rounded-xl p-4 xl:p-6 gap-3">
        <div className="flex items-center gap-4">
          <span className="text-sm xl:text-lg font-semibold">Robert Fox</span>
          <span className="bg-[#0663C91A] text-primary text-[10px] xl:text-sm px-3 py-1 rounded-2xl">
            Default
          </span>
        </div>

        <div className="flex flex-col text-[14px] xl:text-[16px] text-gray-500">
          <span>2464 Royal Ln. Mesa, New Jersey 45463</span>
          <span>(480) 555-0103</span>
        </div>
        <div className="flex gap-4 mt-4 xl:mt-6">
          <Button className="w-24 h-10 rounded-xl border border-gray-300 bg-white text-black">
            {translate("Remove")}
          </Button>
          <Button className="w-24 h-10 rounded-xl">{translate("Edit")}</Button>
        </div>
      </div>
      <EditProfile profile={profile} editKey={editKey} />
    </div>
  );
}
