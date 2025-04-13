"use client";
import React, { useEffect, useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import { getProfileAPI } from "@/lib/web-api/user";
import Loader from "../../components-common/layout/loader";
import EditProfileCreator from "../../components-common/dialogs/edit-profile-creator";
import { useCreatorStore } from "@/lib/store/creator";
interface IProfileCreator {
  user_name: string;
  full_name: string;
  email: string;
  phone: string;
  short_description: string;
  long_description: string;
}

export default function ProfileCreator() {
  const creator = useCreatorStore.getState().creator;
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (creator?.creatorId) {
      setLoading(false);
    }
  }, [creator]);

  return (
    <>
      <div className="flex flex-col w-fit lg:min-w-[562px] bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md flex-wrap">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4">
          <h2 className="text-sm xl:text-xl font-medium">
            {translate("Creator_Information")}
          </h2>
          <div
            onClick={() => setIsOpen(true)}
            className="text-sm text-primary cursor-pointer"
          >
            {translate("edit_profile")}
          </div>
        </div>
        <div className="flex gap-3 xl:gap-4">
          <div className="flex justify-center min-w-fit">
            <img
              src={creator.profile_image || "/assets/product/image-square.svg"}
              className="w-[100px] h-[100px] object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2 text-[14px] xl:text-[16px] text-gray-500 text-nowrap">
            <span>{translate("User_Name")}:</span>
            <span>{translate("Name")}:</span>
            <span>{translate("Mobile")}:</span>
            <span>{translate("Short_Description")}:</span>
            <span>{translate("Long_Description")}:</span>
          </div>
          <div className="flex flex-col text-[14px] xl:text-[16px] gap-2">
            <span className="font-medium">{creator.user_name || "-"}</span>
            <span className="font-medium">{creator.full_name || "-"}</span>
            <span className="font-medium">{creator.phone || "-"}</span>
            <span className="font-medium">
              {creator.short_description || "-"}
            </span>
            <span className="font-medium">
              {creator.long_description || "-"}
            </span>
          </div>
        </div>
        <EditProfileCreator
          open={isOpen}
          onClose={(refresh: boolean = false) => {
            setIsOpen(false);
          }}
        />
      </div>
      {loading && <Loader />}
    </>
  );
}
