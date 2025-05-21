"use client";
import Input from "@/app/_components/ui/form/Input";
import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import { cities, indianStates, businessTypes } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import { Camera, ImageIcon, Pencil, User } from "lucide-react";
import { useVendorStore } from "@/lib/store/vendor";

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
    color: "#9CA3AF", // Tailwind slate-400
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
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.getValue()[0]?.value === "" ? "gray" : "#000000",
    fontSize: '14px',
  }),
};
export default function BasicInfoForm({
  handleImageSelect,
  handleOnSelect = () => { },
  methods,
  formState,
  profilePreview,
  bannerPreview,
  categories = []
}: any) {
  const translate = useTranslations();
  const {
    formState: { errors, touchedFields, submitCount },
  } = useFormContext();
  const {vendor} = useVendorStore();
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);

  useEffect(() => {
    setParentCategory(categories?.filter((ele:ICategoryData) => ele?.parentId === null));
  }, [categories]);

  useEffect(() => {
    (async () => {
      const categoriesId =
        (await methods.watch("category")?.map((v: any) => v.value)) || [];

      const optionsSubCategory = await categories.filter((ele:ICategoryData) =>
        categoriesId?.includes(ele?.parentId)
      );

      setSubCategory(optionsSubCategory);
      const availableSubCategoriesIds = optionsSubCategory.map((v:ICategoryData) => v?._id);
      const subCategoroies = methods.watch("sub_category") || [];
      methods.setValue(
        "sub_category",
        subCategoroies.filter((v: any) =>
          availableSubCategoriesIds.includes(v.value)
        )
      );
    })();
  }, [methods.watch("category")?.length,vendor?.category]);
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
      {/* Banner + Profile Section */}
      <div className="relative col-span-2 w-full h-[200px] rounded-lg bg-gray-100">
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={() => document.getElementById("banner_image")?.click()}
        >
          {bannerPreview || methods.watch("banner_image") ? (
            <img
              src={bannerPreview || methods.watch("banner_image")}
              className="w-full h-full object-cover"
              alt="Banner"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 pt-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow mb-2">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">{translate("Click_to_upload_banner")}</p>
            </div>

          )}
        </div>
        <div className="absolute top-1 right-3 z-10">
          <div
            className="absolute -left-6 top-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            onClick={() => document.getElementById("banner_image")?.click()}
          >
            <Pencil size={14} className="text-gray-600" />
          </div>
          <input
            type="file"
            id="banner_image"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageSelect(e, "banner")}
          />
        </div>
        {/* Profile image */}
        <div
          className="absolute left-1/2 -bottom-[50px] transform -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => document.getElementById("profile-image")?.click()}
        >
          <div className="relative w-[130px] h-[130px] rounded-full border-4 border-white  bg-white shadow-lg flex items-center justify-center">
            {profilePreview || methods.watch("profile_image") ? (
              <img
                src={profilePreview || methods.watch("profile_image")}
                className="w-full h-full object-cover rounded-full"
                alt="Profile"
              />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}

            {/* Camera icon overlay */}

            <div
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("profile-image")?.click();
              }}
              className="absolute bottom-1 right-1 bg-gray-100 rounded-full p-1 cursor-pointer shadow hover:bg-gray-100"
            >
              <Camera size={16} className="text-gray-600" />
            </div>
            <input
              type="file"
              id="profile-image"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageSelect(e, "profile")}
            />
          </div>
        </div>
      </div>
      <div className="col-span-2 flex justify-between">
        {Boolean(get(methods.formState.errors, "banner_image")) && (
          <span className="text-red-600 text-sm p-2 block">
            {methods.formState.errors["banner_image"]?.message}
          </span>
        )}
        {Boolean(get(methods.formState.errors, "profile_image")) && (
          <span className="text-red-600 text-sm p-2 block">
            {methods.formState.errors["profile_image"]?.message}
          </span>
        )}
      </div>
      <div className="md:col-span-1 col-span-2 mt-10">
        <Input
          label={translate("Business_Name")}
          name="business_name"
          type="text"
          placeholder={translate("Enter_your_Business_Name_or_Company Name")}
          autoFocus={true}
        />
      </div>
      <div className="md:col-span-1 col-span-2 md:mt-10">
        <Input
          label={translate("Company_email")}
          name="company_email"
          type="email"
          disabled
          placeholder={translate("Enter_your_email")}
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Business_Category")}
          placeholder={translate("Select_Category")}
          name="category"
          type="multiSelectWithTags"
          options={parentCategory?.map((ele) => ({
            value: ele?._id,
            label: ele?.name,
          }))}
          autoFocus={false}
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Sub_category")}
          placeholder={translate("Select_Sub_Category")}
          name="sub_category"
          type="multiSelectWithTags"
          options={subCategory.map((ele) => ({
            value: ele?._id,
            label: ele?.name,
          }))}
          autoFocus={false}
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Website")}
          placeholder={translate("Enter your website link")}
          name="website"
          type="url"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">
            {translate("Type_of_business")}
            <span className="text-red-500">*</span>
          </span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.type_of_business,
                label: formState.type_of_business ? formState.type_of_business : translate("Select_business_type"),
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "type_of_business")}
            options={
              businessTypes?.map((ele: string) => ({
                value: ele,
                label: ele,
              }))
            }
            menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder={translate("Select_business_type")}
          />
          {methods.formState.errors["type_of_business"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["type_of_business"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Address")}
          name="address"
          type="text"
          placeholder={translate("Enter_your_address")}
          autoFocus
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Pin_Code")}
          name="pin"
          type="number"
          placeholder="XXXXXX"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">
            {translate("State")}
            <span className="text-red-500">*</span>
          </span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.state,
                label: formState.state ? formState.state : translate("Select_State"),
              },
            ]}
            menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
            onChange={(value) => handleOnSelect(value?.value, "state")}
            options={indianStates?.map((ele) => ({ value: ele, label: ele }))}
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder={translate("Select_State")}
          />
          {methods.formState.errors["state"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["state"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="md:col-span-1 col-span-2">
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
                label: formState.city ? formState.city : translate("Select_City"),
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
            menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder={translate("Select_State")}
          />
          {methods.formState.errors["city"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["city"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Contact_Person_Name")}
          name={`contacts[0].name`}
          type="text"
          placeholder={translate("Enter your contact person name")}
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Contact_Person_Email_Address")}
          placeholder={translate("Enter_your_contact_person_email")}
          name={`contacts[0].email`}
          type="email"
        />
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Contact_Person_Phone_Number")}
          name={`contacts[0].phone`}
          type="tel"
          placeholder="XXXXX XXXXX"
        />
      </div>
    </div>
  );
}
