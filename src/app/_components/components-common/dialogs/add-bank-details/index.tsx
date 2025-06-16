"use client";
import React, { useEffect, useState } from "react";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import BankDetailsForm from "./bank-details-form";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import Loading from "@/app/creator/loading";
import BankDetails from "./bank-details-view";

export interface IBeneficiaryInstrumentDetails {
  bank_account_number: string;
  bank_ifsc: string;
}

export interface IBeneficiaryContactDetails {
  beneficiary_phone: string;
  beneficiary_email: string;
}

export interface IBeneficiaryData {
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_instrument_details: IBeneficiaryInstrumentDetails;
  beneficiary_contact_details: IBeneficiaryContactDetails;
  beneficiary_status: string;
  added_on: string;
}

export interface IBankDetails {
  _id: string;
  accountId: string;
  beneficiaryId: string;
  type: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolderName: string;
  createdAt: string;
  updatedAt: string;
  BeneficiaryData: IBeneficiaryData;
}

export default function AddBankDetails({
  open = false,
  onClose,
  handleRefresh = () =>{}
}: any) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(false);
  const initialState = {
    "_id": "",
    "accountId": "",
    "beneficiaryId": "",
    "type": "",
    "bankName": "",
    "accountNumber": "",
    "ifsc": "",
    "accountHolderName": "",
    "createdAt": "",
    "updatedAt": "",
    "BeneficiaryData": {
        "beneficiary_id": "",
        "beneficiary_name": "",
        "beneficiary_instrument_details": {
            "bank_account_number": "",
            "bank_ifsc": ""
        },
        "beneficiary_contact_details": {
            "beneficiary_phone": "",
            "beneficiary_email": ""
        },
        "beneficiary_status": "",
        "added_on": ""
    }
};
  const [bankDetails,setBankDetails] = useState<IBankDetails>(initialState);
  const translate = useTranslations();
  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/payment/wallet/bank-account`);
      if (response?.status === 200 && response?.data?.data?.length > 0) {
        setBankDetails(response?.data?.data[0]);
      } else {
        setBankDetails(initialState)
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }
  useEffect(()=> {
    if(open){
      fetchBankDetails();
    }
  },[open])
  return (
    <DialogLayout
      open={Boolean(open)}
      size={`${bankDetails?._id ?"!max-w-[482px]":"!max-w-[682px]"} w-full overflow-auto m-2`}
      title={bankDetails?._id ? "" : translate("Add_Your_Bank_details")}
      onClose={() => !submitting && onClose()}
    >
      {loading ? <div className="h-[300px]"><Loading height="fit"/></div> : bankDetails?._id ? <BankDetails bankDetails={bankDetails}/> : <div className="pt-0 px-2 sm:px-4 sm:bg-white sm:rounded-md sm:shadow-sm w-full overflow-y-auto relative">
        <BankDetailsForm
          onClose={onClose}
          submitting={submitting}
          setSubmitting={setSubmitting}
          handleRefresh={handleRefresh}
        />
      </div>}
    </DialogLayout>
  );
}
