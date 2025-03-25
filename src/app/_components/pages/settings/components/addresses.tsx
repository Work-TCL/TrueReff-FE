"use client";
import EditAddressProfile from "@/app/_components/components-common/dialogs/address-profile";
import { Button } from "@/components/ui/button";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { translate } from "@/lib/utils/translate";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddressesProfile(props: any) {
  const axios = useAxiosAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState<any>([
    ...(props?.addresses || []),
  ]);
  const [currentAddress, setCurrentAddress] = useState<any>(null);

  useEffect(() => {
    setAddresses([...(props?.addresses || [])]);
  }, [props?.addresses]);

  const handleRemoveAddress = async (index: number) => {
    try {
      let response: any = await axios.delete(`/auth/vendor/address/${index}`);

      if (response?.status === 200) {
        setAddresses(addresses.filter((_: any, i: number) => i != index));
        toast.success(response?.message);
        props.refreshCentral && props.refreshCentral();
        return true;
      }
      throw response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
    }
  };

  const handleEditAddress = async (index: number) => {
    setCurrentAddress(index);
  };
  const removeText = translate("Remove");
  const editText = translate("Edit");
  return (
    <div>
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mt-6 mb-4">
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("saved_address")}
        </h2>
        <div
          onClick={() => {
            setIsOpen(true);
            setCurrentAddress(null);
          }}
          className="text-sm text-primary cursor-pointer"
        >
          {translate("add_new_address")}
        </div>
      </div>
      <div className="items-center gap-4 flex-wrap w-full grid lg:grid-cols-2 grid-cols-1">
        {Array.isArray(addresses) &&
          addresses?.map((value: any, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col w-full xl:max-w-[320px] border border-gray-300 rounded-xl p-4 xl:p-5 gap-3 h-full"
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

                <div className="flex flex-col text-[14px] xl:text-[16px] text-gray-500 flex-1">
                  <span className="text-sm">
                    {value?.house_no} {value?.address}, {value?.city}{" "}
                    {value?.state} {value?.zip_code}
                  </span>
                  <span className="text-base pt-1">{value?.phone}</span>
                </div>
                <div className="flex gap-4 mt-2 xl:mt-2">
                  <Button
                    onClick={() => handleRemoveAddress(index)}
                    className="w-24 h-10 rounded-xl border border-gray-300 bg-white text-black"
                  >
                    {removeText}
                  </Button>
                  <Button
                    onClick={() => {
                      handleEditAddress(index);
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
      <EditAddressProfile
        open={isOpen}
        address={currentAddress !== null && addresses[currentAddress]}
        id={currentAddress ?? "new-address"}
        onClose={(refresh = false) => {
          setIsOpen(false);
          setCurrentAddress(null);
          refresh && props.refreshCentral && props.refreshCentral();
        }}
      />
    </div>
  );
}
