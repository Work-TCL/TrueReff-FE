"use client";
import React, { useEffect, useState } from "react";
import EditProfile from "@/app/_components/components-common/dialogs/edit-profile";
import AddressesProfile from "./components/addresses";
import ContactsProfile from "./components/contacts";
import { getProfileAPI } from "@/lib/web-api/user";
import Loader from "../../components-common/layout/loader";
import { useVendorStore } from "@/lib/store/vendor";
import { useTranslations } from "next-intl";
interface IProfile {
  business_name: string;
  company_email: string;
  pin_code: string;
  type_of_business: string;
  website: string;
  state: string;
  city: string;
  address: string;
  profile_image: string;
  banner_image: string;
  createdAt: string;
  updatedAt: string;
  gst_certificate: string;
  gst_number: string;
  pan_number: string;
  contacts: {
    name: string;
    phone: string;
    email: string;
    isDefault: boolean;
  }[];
}

export default function Profile() {
  const translate = useTranslations();
  const initialState = {
    contacts: [{
      name: "",
      phone: "",
      email: "",
      isDefault: false,
    },],
    business_name: "",
    company_email: "",
    pin_code: "",
    type_of_business: "",
    website: "",
    state: "",
    city: "",
    address: "",
    profile_image: "",
    banner_image: "",
    createdAt: "",
    updatedAt: "",
    gst_certificate: "",
    gst_number: "",
    pan_number: "",
  };
  const [profile, setProfile] = useState<IProfile>(initialState);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { vendor } = useVendorStore();

  const getProfile = async () => {
    setLoading(true);
    const response = await getProfileAPI();

    if (response?.vendor) {
      setLoading(false);
      setProfile({ ...response?.vendor });
    } else {
      setLoading(false);
      setProfile(initialState);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <div className="flex flex-col  w-full lg:min-w-[562px] bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md flex-wrap">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4">
          <h2 className="text-sm xl:text-xl font-medium">
            {translate("Personal_Information")}
          </h2>
          <div
            onClick={() => setIsOpen(true)}
            className="text-sm text-primary cursor-pointer capitalize"
          >
            {translate("edit_profile")}
          </div>
        </div>
        {/* <div className="flex flex-col items-center">
          <div className="flex justify-center min-w-fit">
            <img
              src={vendor.profile_image || "/assets/product/image-square.svg"}
              className="w-[150px] h-[150px] object-cover rounded-full"
            />
          </div>
          <h2 className="text-lg font-semibold mt-4">{profile.business_name}</h2>
          <p className="text-zinc-400 text-sm">{profile.company_email}</p>
        </div>
        <div className="grid grid-cols-2 justify-center gap-x-6 gap-y-4 mt-6 text-sm">
          {[
            ["Website", profile.website || "-"],
            ["Business_Type", profile.type_of_business || "-"],
            ["Address", profile.address || "-"],
            ["Pin_Code", profile.pin_code || "-"],
            ["State", profile.state || "-"],
            ["City", profile.city || "-"],
            ["GST_Number", profile.gst_number || "-"],
            ["PAN_Number", profile.pan_number || "-"],
          ].map(([label, value], idx) => (
            <div className="flex gap-2">
              <p className="text-zinc-500">{translate(label as string)}:</p>
              <p className="text-black">{value}</p>
            </div>
          ))}
        </div> */}
        <div className="flex flex-col md:flex-row gap-5 xl:gap-4">
          <div className="flex justify-center min-w-fit">
            <img
              src={vendor.profile_image || "/assets/product/image-square.svg"}
              className="w-[100px] h-[100px] object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row md:flex-row gap-3">
          <div className="flex flex-col gap-3">
            {[
              ["Name", profile.business_name || "-"],
              ["Email", profile.company_email || "-"],
              ["Website", profile.website || "-"],
              ["Business_Type", profile.type_of_business || "-",],
              ["GST_Number", profile.gst_number || "-"]
            ].map(([label, value], idx) => (
              <div key={idx} className="flex flex-row md:flex-row items-start gap-2">
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
              ["Address", profile.address || "-"],
              ["Pin_Code", profile.pin_code || "-"],
              ["State", profile.state || "-"],
              ["City", profile.city || "-"],
              ["PAN_Number", profile.pan_number || "-"]
            ].map(([label, value], idx) => (
              <div key={idx} className="flex flex-row items-start gap-2">
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
        </div>
        <ContactsProfile
          contacts={Array.isArray(profile?.contacts) ? profile?.contacts : []}
          refreshCentral={() => getProfile()}
        />
        <EditProfile
          open={isOpen}
          profile={vendor}
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
