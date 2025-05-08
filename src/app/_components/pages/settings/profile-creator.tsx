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
      <div className="flex flex-col w-full lg:min-w-[562px] bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md flex-wrap">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4 capitalize">
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
        <div className="flex flex-col md:flex-row gap-5 xl:gap-4">
          <div className="flex justify-center min-w-fit">
            <img
              src={creator.profile_image || "/assets/product/image-square.svg"}
              className="w-[100px] h-[100px] object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            {[
              ["User_Name", creator.user_name],
              ["Name", creator.full_name],
              ["Mobile", creator.phone],
              ["Short_Description", creator.short_description],
              ["Long_Description", creator.long_description],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-[120px] text-sm text-gray-500 text-nowrap">
                  {translate(label as string)}:
                </div>
                <div className="font-medium text-sm break-words">
                  {value || "-"}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {[
              ["State", creator.state],
              ["City", creator.city],
              ["Gender", creator.gender],
              ["Date_Of_Birth", new Date(creator.dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-[120px] text-sm text-gray-500 text-nowrap">
                  {translate(label as string)}:
                </div>
                <div className="font-medium text-sm break-words">
                  {value || "-"}
                </div>
              </div>
            ))}
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
