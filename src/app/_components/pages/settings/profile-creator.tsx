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
        <div className="flex flex-col md:flex-row gap-3 xl:gap-4">
          <div className="flex justify-center min-w-fit">
            <img
              src={creator.profile_image || "/assets/product/image-square.svg"}
              className="w-[100px] h-[100px] object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-2 ">
              <div className="w-1/6 text-[14px] xl:text-[16px] text-gray-500 text-nowrap">{translate("User_Name")}:</div>
              <div className="font-medium w-5/6">{creator.user_name || "-"}</div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 ">
              <div className="w-1/6 text-[14px] xl:text-[16px] text-gray-500 text-nowrap">{translate("Name")}:</div>
              <div className="font-medium w-5/6">{creator.full_name || "-"}</div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 ">
              <div className="w-1/6 text-[14px] xl:text-[16px] text-gray-500 text-nowrap">{translate("Mobile")}:</div>
              <div className="font-medium w-5/6">{creator.phone || "-"}</div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 ">
              <div className="w-1/6 text-[14px] xl:text-[16px] text-gray-500 text-nowrap">{translate("Short_Description")}:</div>
              <div className="font-medium w-5/6">{creator.short_description || "-"}</div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 ">
              <div className="w-1/6 text-[14px] xl:text-[16px] text-gray-500 text-nowrap">{translate("Long_Description")}:</div>
              <div className="font-medium w-5/6">{creator.long_description || "-"}</div>
          </div>
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
