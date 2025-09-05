"use client";
import EditContactProfile from "@/app/_components/components-common/dialogs/contacts-profile";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import axios from "@/lib/web-api/axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "./confirmDialog";
import { useTranslations } from "next-intl";

export default function ContactsProfile(props: any) {
  const translate = useTranslations();
  const [isOpen, setIsOpen] = useState<any>(false);
  const [contacts, setContacts] = useState<any[]>([...(props?.contacts || [])]);
  const [currentContact, setCurrentContact] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false); // <-- new
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState<number | null>(
    null
  );

  const handleRemoveContact = async (index: number) => {
    try {
      let response: any = await axios.delete(`/auth/vendor/contact/${index}`);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        props.refreshCentral && props.refreshCentral();
        return true;
      }
      throw response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  const handleEditContact = async (index: number) => {
    setCurrentContact(index);
  };

  const confirmRemove = (index: number) => {
    setSelectedDeleteIndex(index);
    setShowConfirm(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedDeleteIndex !== null) {
      await handleRemoveContact(selectedDeleteIndex);
      setSelectedDeleteIndex(null);
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    setContacts([...(props?.contacts || [])]);
  }, [props?.contacts]);

  const removeText = translate("Remove");
  const editText = translate("Edit");

  return (
    <div>
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mt-6 mb-4">
        <h2 className="text-sm xl:text-xl font-medium capitalize">
          {translate("saved_contacts")}
        </h2>
        <div
          onClick={() => {
            setIsOpen(true);
            setCurrentContact(null);
          }}
          className="text-sm text-primary cursor-pointer capitalize"
        >
          {translate("add_new_contact")}
        </div>
      </div>
      <div className="items-center gap-4 flex-wrap w-full flex">
        {contacts?.map((value, index, array) => {
          return (
            <div
              key={index}
              className="flex flex-col w-full max-w-[320px] xsmobile:max-w-full border border-gray-300 rounded-xl p-4 xl:p-5 gap-3"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm xl:text-lg font-semibold">
                  {value?.name}
                </span>
                {value?.isDefault && (
                  <span className="bg-[#FFEDF2] text-primary text-[10px] xl:text-xs px-3 py-1 rounded-2xl">
                    Default
                  </span>
                )}
              </div>

              <div className="flex flex-col text-[14px] xl:text-[16px] text-gray-500">
                <span className="text-sm">{value?.email}</span>
                <span className="text-base pt-1">{value?.phone}</span>
              </div>
              <div className="flex gap-4 mt-2 xl:mt-2">
                <Button
                  onClick={() => confirmRemove(index)}
                  className="w-24 h-10 rounded-xl border border-gray-300 bg-white text-black"
                >
                  {removeText}
                </Button>
                <Button
                  onClick={() => {
                    handleEditContact(index);
                    setIsOpen(true);
                  }}
                  className="w-24 h-10 rounded-xl border border-gray-300 bg-black text-white"
                >
                  {editText}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {showConfirm && (
        <ConfirmDialog
          open={showConfirm}
          description="Are you sure you want to remove this contact?"
          warning="Note: This action cannot be undone."
          onClose={() => {
            setShowConfirm(false);
            setSelectedDeleteIndex(null);
          }}
          onConfirm={handleConfirmRemove}
        />
      )}
      <EditContactProfile
        open={isOpen}
        contact={currentContact !== null && contacts[currentContact]}
        id={currentContact ?? "new-contacts"}
        onClose={(refresh = false) => {
          setCurrentContact(null);
          setIsOpen(false);
          refresh && props.refreshCentral && props.refreshCentral();
        }}
      />
    </div>
  );
}
