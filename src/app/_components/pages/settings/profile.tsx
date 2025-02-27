"use client";
import Button from "@/app/_components/ui/button";
import React, { useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import EditProfile from "@/app/_components/components-common/dialogs/edit-profile";
import Link from "next/link";
import EditAddressProfile from "../../components-common/dialogs/address-profile";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import AnchorButton from "../../ui/button/variant";
import { useRouter } from "next/navigation";
import AddressesProfile from "./components/addresses";
import ContactsProfile from "./components/contacts";

interface IProps {
  profile: {
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
  };
  editKey?: string;
}

export default function Profile({ profile, editKey }: IProps) {
  const vendor = profile;
  return (
    <div className="flex flex-col w-fit lg:min-w-[562px] bg-white rounded-xl p-4 xl:p-6 gap-4 shadow-md flex-wrap">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <h2 className="text-sm xl:text-xl font-medium">
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
          <span className="font-medium">{vendor.business_name || "-"}</span>
          <span className="font-medium">{vendor.company_email || "-"}</span>
          <span className="font-medium">{vendor.company_phone || "-"}</span>
        </div>
      </div>
      <AddressesProfile editKey={editKey} addresses={profile?.addresses} />
      <ContactsProfile editKey={editKey} contacts={profile?.contacts} />
      <EditProfile
        profile={profile}
        editKey={editKey}
        onClose={() => {
          // setCurrentAddress(null);
          if (typeof window !== undefined) window.location.reload();
        }}
      />
    </div>
  );
}
