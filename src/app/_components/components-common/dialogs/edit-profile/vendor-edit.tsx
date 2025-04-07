"use client";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  IVendorProfileUpdateSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { translate } from "@/lib/utils/translate";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { useSession } from "next-auth/react";

export default function EditVendorForm({
  profile,
  onClose,
}: {
  profile: any;
  onClose: any;
}) {
  const axios:any = useAxiosAuth();
  const {update} = useSession();
  const [loading, setLoading] = useState(false);
  const schema = vendorProfileUpdateSchema;
  const methods = useForm<IVendorProfileUpdateSchema>({
    defaultValues: {
      company_email: profile?.company_email || "",
      company_phone: profile?.company_phone || "",
      gst_number: profile?.gst_number || "",
      website: profile?.website || "",
      business_name: profile?.business_name || "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = async (data: IVendorProfileUpdateSchema) => {
    setLoading(true);
    try {
      ("use server")
      const payload = data;
      //   delete payload.company_email
      //   delete payload.company_phone
      let response: any = await axios.patch("/auth/vendor", payload);
      if (response?.data) {
        response = response?.data;
      }
      if (response?.status === 200) {
        toast.success(response?.message);
        methods?.reset();
        await update();
        console.log("response",data)
        onClose && onClose(true);
        return true;
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-2 text-left gap-3 w-full relative"
        >
          <div className="col-span-2">
            <Input
              name="company_email"
              label={translate("Company_Email")}
              type="email"
              placeholder={translate("Company_Email")}
            />
          </div>
          <Input
            name="company_phone"
            label={translate("Company_Phone")}
            type="phone"
            placeholder={translate("Company_Phone")}
          />
          <Input
            name="gst_number"
            label={translate("GST_Number")}
            type="text"
            placeholder={translate("GST_Number")}
          />
          <Input
            name="website"
            label={translate("Website")}
            type="url"
            placeholder={translate("Website")}
          />
          <Input
            name="business_name"
            label={translate("Business_Name")}
            type="text"
            placeholder={translate("Business_Name")}
          />
          <div className="mt-6 col-span-2 sticky bottom-0 bg-white">
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
