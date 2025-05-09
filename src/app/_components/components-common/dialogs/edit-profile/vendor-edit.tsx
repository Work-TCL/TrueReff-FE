"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  IVendorProfileUpdateSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import {
  cities,
  fileUploadLimitValidator,
  indianStates,
} from "@/lib/utils/constants";
import Select from "react-select";
import { get } from "lodash";
import { useTranslations } from "next-intl";
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
export default function EditVendorForm({
  profile,
  onClose,
}: {
  profile: any;
  onClose: any;
}) {
  const translate = useTranslations();
  const { setVendorData } = useVendorStore();
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(
    profile?.profile_image || ""
  );
  const initialState = {
    state: profile?.state ?? "",
    city: profile?.city ?? "",
  };
  const [formState, setFormState] = useState(initialState);
  useEffect(() => {
    if (profile) {
      setFormState({ state: profile?.state, city: profile?.city });
    }
  }, [profile]);
  const schema = vendorProfileUpdateSchema;
  const methods = useForm<IVendorProfileUpdateSchema>({
    defaultValues: {
      company_email: profile?.company_email || "",
      company_phone: profile?.company_phone || "",
      gst_number: profile?.gst_number || "",
      website: profile?.website || "",
      business_name: profile?.business_name || "",
      state: profile?.state,
      city: profile?.city,
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
          state: response.data?.state,
          city: response.data?.city,
        });
        toast.success(response?.message);
        methods?.reset();
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    setProfileFile(file);
    setProfilePreview(previewURL);
  };

  const handleDropImage = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    setProfileFile(file);
    setProfilePreview(previewURL);
  };
  const handleOnSelect = (value: any, name: any) => {
    setFormState({ ...formState, [name]: value });
    methods.setValue(name, value);
    if (name === "state") {
      setFormState({ ...formState, [name]: value, city: "" });
      methods.setValue("city", "");
    }
    if (value) {
      methods.setError(name, {
        type: "manual",
        message: "",
      });
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
          <div className="col-span-1">
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-gray-500 font-semibold">
                {"State"}
                <span className="text-red-500">*</span>
              </span>
              <Select
                styles={customStyles}
                value={[
                  {
                    value: formState.state,
                    label: formState.state ? formState.state : "Select State",
                  },
                ]}
                onChange={(value) => handleOnSelect(value?.value, "state")}
                options={indianStates?.map((ele) => ({
                  value: ele,
                  label: ele,
                }))}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder="Select State"
              />
              {Boolean(get(methods.formState.errors, "state")) && (
                <span className="text-red-600 text-sm p-2 block">
                  {methods.formState.errors["state"]?.message}
                </span>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-gray-500 font-semibold">
                {translate("City")}
                <span className="text-red-500">*</span>
              </span>
              <Select
                styles={customStyles}
                value={[
                  {
                    value: formState.city,
                    label: formState.city ? formState.city : "Select City",
                  },
                ]}
                onChange={(value) => handleOnSelect(value?.value, "city")}
                options={
                  formState.state
                    ? cities[formState?.state]?.map((ele: string) => ({
                        value: ele,
                        label: ele,
                      }))
                    : []
                }
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder={translate("selectCity")}
              />
              {Boolean(get(methods.formState.errors, "city")) && (
                <span className="text-red-600 text-sm p-2 block">
                  {methods.formState.errors["city"]?.message}
                </span>
              )}
            </div>
          </div>
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
            <div
              className="flex justify-center items-center border rounded-lg p-5"
              onDrop={handleDropImage}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => {
                document.getElementById("profile-image")?.click();
              }}
            >
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
                {/* <Button
                  type="button"
                  className="w-full disabled:cursor-not-allowed"
                  onClick={() => {
                    document.getElementById("profile-image")?.click();
                  }}
                >
                  {translate("Upload_your_photo")}
                </Button> */}
              </div>
            </div>
          </div>
          <div className="pt-6 col-span-2 sticky bottom-0 bg-white">
            <Button type="submit" loading={loading}>
              {translate("Save")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
