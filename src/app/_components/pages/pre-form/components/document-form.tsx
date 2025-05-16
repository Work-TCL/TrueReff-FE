"use client";
import React from "react";
import Input from "@/app/_components/ui/form/Input";
import FileUploadBox from "@/app/_components/components-common/DocumentUpload";
import { useTranslations } from "next-intl";

interface IDocumentDetailsFormProps {
    handleDocumentUpload: (e:any,name:string) => void;
    methods: any;
    terms: boolean;
    handleCheckTerms: (e: any) => void;
    gstCertificateFile: File | null;
}
export default function DocumentDetailsForm({methods,handleDocumentUpload,handleCheckTerms,terms,gstCertificateFile}:IDocumentDetailsFormProps) {
    const translate = useTranslations();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("GST_Number")}
          name="gst_number"
          type="text"
          placeholder={translate("Enter_your_GST_number")}
          autoFocus
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("PAN_Number")}
          name="pan_number"
          type="text"
          placeholder={translate("Enter_your_PAN_number")}
        />
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <span className="mb-1 text-sm text-gray-500 font-semibold">
            {translate("GST_Certificate")}
            <span className="text-red-500">*</span>
        </span>
        <FileUploadBox uploadedFile={gstCertificateFile} handleUploadFile={(file:any)=> handleDocumentUpload(file,"")}/>
        {methods.formState.errors["gst_certificate"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["gst_certificate"]?.message}
            </span>
          )}
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
      <label className="mt-3 text-xs flex align-middle gap-2 text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={terms}
            onChange={handleCheckTerms}
          />
          <span className="text-sm">
            {translate("By_Signing_up,_you_agree_to_our")}{" "}
            <span className="text-primary-color font-medium">
              {translate("Privacy_Policy")}
            </span>{" "}
            &{" "}
            <span className="text-primary-color font-medium">
              {translate("Terms_of_Use")}.
            </span>
          </span>
        </label>
        </div>
    </div>
  );
}
