"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  banDetailsSchema,
  IBankDetailSchema,
  IVendorProfileUpdateSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import {
  businessTypes,
  cities,
  fileUploadLimitValidator,
  indianStates,
} from "@/lib/utils/constants";
import Select from "react-select";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { getCategories } from "@/lib/web-api/auth";
import { Camera, Landmark, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/lib/utils/toast-message";

export interface ICategoryData {
  _id: string;
  name: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    height: "54px",
    borderRadius: "8px",
  }),
  options: (base: any) => ({
    ...base,
    zIndex: 999,
  }),
};
export default function BankDetailsForm({
  submitting,
  setSubmitting = () => { },
  handleRefresh = () => { },
  onClose,
}: {
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  handleRefresh: () => void;
  onClose: any;
}) {
  const translate = useTranslations();
  const schema = banDetailsSchema;
  const methods = useForm<IBankDetailSchema>({
    defaultValues: {
      account_number: "",
      confirm_account_number: "",
      IFSC_code: "",
      phone_number: "",
      account_holder_name: ""
    },
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: IBankDetailSchema) => {
    setSubmitting(true);
    try {
      ("use server");
      const payload: any = {
        accountNumber: data?.account_number,
        ifsc: data?.IFSC_code,
        accountHolderName: data?.account_holder_name,
        phoneNumber: data?.phone_number,
        type: "BANK",
      };
      let response: any = await axios.post("/payment/wallet/bank-account", payload);
      if (response?.status === 201) {
        toast.success(response?.data?.message);
        methods?.reset();
        onClose();
        handleRefresh();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-2 text-left gap-2 w-full relative"
        >
          <div className="col-span-2 mt-2">
            <Input
              label={translate("Account_Holder_Name")}
              name="account_holder_name"
              type="text"
              placeholder={translate("Enter_Account_Holder_Number")}
              lableClassName="text-md font-[400]"
              autoFocus={true}
            />
          </div>
          <div className="md:col-span-1 col-span-2 mt-2">
            <Input
              label={translate("Account_Number")}
              name="account_number"
              type="text"
              placeholder={translate("Enter_your_bank_account_number")}
              lableClassName="text-md font-[400]"
            />
          </div>
          <div className="md:col-span-1 col-span-2 mt-2">
            <Input
              label={translate("Confirm_Account_Number")}
              name="confirm_account_number"
              type="text"
              placeholder={translate("Confirm_bank_account_number")}
              lableClassName="text-md font-[400]"
            />
          </div>
          <div className="md:col-span-1 col-span-2 mt-2">
            <Input
              label={translate("IFSC_Code")}
              name="IFSC_code"
              type="text"
              placeholder={translate("Enter_your_bank_ifsc_code")}
              lableClassName="text-md font-[400]"
            />
          </div>
          <div className="md:col-span-1 col-span-2 mt-2">
            <Input
              label={translate("Phone_Number")}
              name="phone_number"
              type="number"
              placeholder={translate("Enter_your_phone_number")}
              lableClassName="text-md font-[400]"
            />
          </div>
          <div className="pt-6 pb-2 col-span-2 flex justify-end sticky bottom-0 bg-white">
            <div className="flex justify-end gap-2 w-1/2">
              <Button type="button" size="small" className="bg-white border text-secondary" disabled={submitting} onClick={onClose}>
                {translate("Cancel")}
              </Button>
              <Button type="submit" size="small" className="" disabled={submitting} loading={submitting}>
                {translate("Save")}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
