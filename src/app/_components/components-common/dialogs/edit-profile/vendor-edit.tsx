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
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";

export default function EditVendorForm({
  profile,
  onClose,
}: {
  profile: any;
  onClose: any;
}) {
  const { setVendorData } = useVendorStore();
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(
    profile?.profile_image || ""
  );

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
      ("use server");
      const payload: any = { ...data };
      if (profileFile) {
        payload["profile_image"] = profileFile;
      }
      //   delete payload.company_email
      //   delete payload.company_phone
      let response: any = await axios.patch("/auth/vendor", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data) {
        response = response?.data;
      }
      if (response?.status === 200) {
        setVendorData("vendor", {
          company_email: data.company_email,
          company_phone: data.company_phone,
          gst_number: data.gst_number,
          website: data.website,
          business_name: data.business_name,
          profile_image: response.data?.profile_image,
        });
        toast.success(response?.message);
        methods?.reset();
        console.log("response", data);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    setProfileFile(file);
    setProfilePreview(previewURL);
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
          <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
            <div className="text-sm">{translate("Profile_Image")}</div>
            <div className="flex justify-center items-center border rounded-lg p-5">
              <div className="flex flex-col w-full gap-4">
                <div className="flex justify-center">
                  <img
                    src={profilePreview || "/assets/product/image-square.svg"}
                    className="w-[100px] h-[100px] object-cover rounded-full"
                  />
                </div>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e)}
                />
                <Button
                  type="button"
                  className="w-full disabled:cursor-not-allowed"
                  onClick={() => {
                    document.getElementById("profile-image")?.click();
                  }}
                >
                  {translate("Upload_your_photo")}
                </Button>
              </div>
            </div>
          </div>
          <div className="py-6 col-span-2 sticky bottom-0 bg-white">
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
