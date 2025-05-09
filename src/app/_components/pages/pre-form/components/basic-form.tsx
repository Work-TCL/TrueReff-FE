"use client";
import { Button as ButtonOutline } from "@/components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import React from "react";
import { get } from "lodash";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import { cities, indianStates } from "@/lib/utils/constants";
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
export default function BasicInfoForm({
  handleImageSelect,
  handleOnSelect = () => {},
  methods,
  formState,
  profilePreview,
}: any) {
  const translate = useTranslations();
  const {
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();

  const getErrorMessage = (name: string) => {
    const error = get(errors, name);
    if (error && error.message) {
      return error.message as string;
    }
    return null;
  };
  const getError = () => {
    return (
      Boolean(get(errors, "type_of_business")) && (
        <span className="text-red-600 text-sm p-2">
          {getErrorMessage("type_of_business")}
        </span>
      )
    );
  };
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="col-span-2">
        <Input
          label="Business Name"
          name="business_name"
          type="text"
          placeholder="business"
          autoFocus
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Company email"
          name="company_email"
          type="email"
          placeholder="business@example.com"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Company Phone Number"
          placeholder="+91 958 624 7482 "
          name="company_phone"
          type="phone"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="GST Number"
          placeholder="27ABCDE1234F1Z5"
          name="gst_number"
          type="phone"
        />
      </div>
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
            options={indianStates?.map((ele) => ({ value: ele, label: ele }))}
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
            {"City"}
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
            placeholder="Select State"
          />
          {Boolean(get(methods.formState.errors, "city")) && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["city"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Website"
          placeholder="www.truereff.com"
          name="website"
          type="url"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label="Type of business"
          placeholder="Select business type"
          name="type_of_business"
          type="select"
          options={[
            {
              label: "business type 1",
              value: "business type 1",
            },
            {
              label: "business type 2",
              value: "business type 2",
            },
          ]}
        />
        {/* <label
          htmlFor="type_of_business"
          className="block mb-1 text-sm text-gray-500 font-semibold"
        >
          Type of business
        </label>
        <select
          id="type_of_business"
          name="type_of_business"
          defaultValue=""
          className="w-full px-4 py-4 rounded-xl font-medium border border-gray-light placeholder:text-gray-color placeholder:font-normal text-sm focus:outline-none focus:border-gray-light focus:bg-white disabled:cursor-not-allowed"
          onChange={(e) => setCommissionType(e.target.value)}

        >
          <option value="" disabled hidden>
            Select business type
          </option>
          <option value="business type 1">business type 1</option>
          <option value="business type 2">business type 2</option>
        </select>
        {getError()} */}
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm font-medium text-gray-500">
          {translate("Profile_Image")}
        </div>
        <div className="flex justify-center items-center border rounded-lg p-5">
          <div className="flex flex-col w-full gap-4 relative">
            <div className="flex justify-center">
              <img
                src={profilePreview || "/assets/product/image-square.svg"}
                className="w-[100px] h-[100px] object-cover rounded-full"
              />
            </div>
            <input
              type="file"
              id="profile-image"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => handleImageSelect(e, "profile")}
            />
            <ButtonOutline
              variant="outline"
              type="button"
              className="w-full disabled:cursor-not-allowed"
              onClick={() => {
                document.getElementById("profile-image")?.click();
              }}
            >
              {translate("Upload_your_photo")}
            </ButtonOutline>
          </div>
        </div>
      </div>
      {/* <div className="col-span-2">
          <Input
            label="Brand documents"
            placeholder="GST Certificate"
            name="gstCertificate"
            type="select"
            options={[
              {
                label: "GST Certificate 1",
                value: "business type 1",
              },
              {
                label: "GST Certificate 1",
                value: "business type 2",
              },
            ]}
          />
        </div> */}
    </div>
  );
}
