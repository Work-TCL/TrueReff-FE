"use client";
import React, { useEffect, useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import EditProfile from "@/app/_components/components-common/dialogs/edit-profile";
import AddressesProfile from "./components/addresses";
import ContactsProfile from "./components/contacts";
import { getProfileAPI } from "@/lib/web-api/user";
import Loader from "../../components-common/layout/loader";
interface IProfileCreator {
  user_name: string;
  name: string;
  email: string;
  phone: string;
}

export default function ProfileCreator() {
  const [profile, setProfile] = useState<IProfileCreator>({
    user_name: "",
    name: "",
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    const response = await getProfileAPI();
    console.log("response------->>", response?.creator);
      
    if (response?.creator) {
      setLoading(false);
      setProfile({
        user_name: response?.creator?.user_name,
        name: response?.creator?.full_name,
        email: response?.creator?.email,
        phone: response?.creator?.phone });
    } else {
      setLoading(false);
      setProfile({
        user_name: "",
        name: "",
        email: "",
        phone: ""
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <div className="flex flex-col w-fit lg:min-w-[562px] bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md flex-wrap">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4">
          <h2 className="text-sm xl:text-xl font-medium">
            {translate("Personal_Information")}
          </h2>
          <div
            onClick={() => setIsOpen(true)}
            className="text-sm text-primary cursor-pointer"
          >
            {translate("edit_profile")}
          </div>
        </div>
        <div className="flex gap-3 xl:gap-4">
          <div className="flex flex-col gap-2 text-[14px] xl:text-[16px] text-gray-500">
            <span>{translate("User_Name")}:</span>
            <span>{translate("Name")}:</span>
            <span>{translate("Email")}:</span>
            <span>{translate("Mobile")}:</span>
          </div>
          <div className="flex flex-col text-[14px] xl:text-[16px] gap-2">
            <span className="font-medium">{profile.user_name || "-"}</span>
            <span className="font-medium">{profile.name || "-"}</span>
            <span className="font-medium">{profile.email || "-"}</span>
            <span className="font-medium">{profile.phone || "-"}</span>
          </div>
        </div>
        <EditProfile
          open={isOpen}
          profile={profile}
          onClose={() => {
            setIsOpen(false);
            getProfile();
          }}
        />
      </div>
      {loading && <Loader />}
    </>
  );
}
