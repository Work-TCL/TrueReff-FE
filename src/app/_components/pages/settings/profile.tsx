"use client";
import React, { useEffect, useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import EditProfile from "@/app/_components/components-common/dialogs/edit-profile";
import AddressesProfile from "./components/addresses";
import ContactsProfile from "./components/contacts";
import { getProfileAPI } from "@/lib/web-api/user";
import Loader from "../../components-common/layout/loader";
interface IProfile {
  business_name: string;
  company_email: string;
  company_phone: string;
  addresses: any[];
  contacts: {
    name: string;
    phone: string;
    email: string;
    isDefault: boolean;
  }[];
}

export default function Profile() {
  const [profile, setProfile] = useState<IProfile>({
    business_name: "",
    company_email: "",
    company_phone: "",
    addresses: [],
    contacts: [
      {
        name: "",
        phone: "",
        email: "",
        isDefault: false,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getProfile = async () => {
    setLoading(true);
    const response = await getProfileAPI();
    if (response?.vendor) {
      setLoading(false);
      setProfile({ ...response?.vendor });
    } else {
      setLoading(false);
      setProfile({
        business_name: "",
        company_email: "",
        company_phone: "",
        addresses: [],
        contacts: [
          {
            name: "",
            phone: "",
            email: "",
            isDefault: false,
          },
        ],
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
            <span>{translate("Name")}:</span>
            <span>{translate("Email")}:</span>
            <span>{translate("Mobile")}:</span>
          </div>
          <div className="flex flex-col text-[14px] xl:text-[16px] gap-2">
            <span className="font-medium">{profile.business_name || "-"}</span>
            <span className="font-medium">{profile.company_email || "-"}</span>
            <span className="font-medium">{profile.company_phone || "-"}</span>
          </div>
        </div>
        <AddressesProfile
          addresses={
            Array.isArray(profile?.addresses) ? profile?.addresses : []
          }
          refreshCentral={() => getProfile()}
        />
        <ContactsProfile
          contacts={Array.isArray(profile?.contacts) ? profile?.contacts : []}
          refreshCentral={() => getProfile()}
        />
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
