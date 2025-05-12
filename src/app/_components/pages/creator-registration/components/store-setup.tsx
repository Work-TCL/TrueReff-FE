"use client";
import Input from "@/app/_components/ui/form/Input";
import React, { useEffect, useState } from "react";
import { getCategories } from "@/lib/web-api/auth";
import { useFormContext } from "react-hook-form";
import { Camera, Image, ImageIcon, Layout, Pencil, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { get } from "lodash";

export interface ICategoryData {
  _id: string;
  name: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

interface IProps {
  handleImageSelect: any;
  profilePreview: any;
  bannerPreview: any;
  methods: any;
}

export default function StoreSetup({
  handleImageSelect,
  bannerPreview,
  profilePreview,
  methods,
}: IProps) {
  const translate = useTranslations();
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
    } catch (error:any) {
      console.log("Error Fetching channels",error.message);
     }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    (async () => {
      const categoriesId =
        (await methods.watch("category")?.map((v: any) => v.value)) || [];

      const optionsSubCategory = await categories.filter((ele) =>
        categoriesId?.includes(ele?.parentId)
      );

      setSubCategory(optionsSubCategory);
      const availableSubCategoriesIds = optionsSubCategory.map((v) => v?._id);
      const subCategoroies = methods.watch("sub_category") || [];
      methods.setValue(
        "sub_category",
        subCategoroies.filter((v: any) =>
          availableSubCategoriesIds.includes(v.value)
        )
      );
    })();
  }, [methods.watch("category")?.length]);

  return (
    <div className="flex flex-col gap-4">
      {/* Banner + Profile Section */}
      <div className="relative w-full h-[200px] rounded-lg bg-gray-100">
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
            // <div className="flex flex-col items-center justify-center text-gray-500 pt-6">
            //   {/* <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow mb-2">
            //     <ImageIcon className="w-6 h-6" />
            //   </div> */}
            //   <div className="flex items-center justify-center mb-3">
            //     <Layout className="w-8 h-8 text-gray-400 mr-2" />
            //     <Image className="w-8 h-8 text-gray-400" />
            //   </div>
            //   <p className="text-sm font-medium">
            //     {translate("Click_to_upload_banner_Images")}
            //   </p>
            <main
              role="img"
              aria-label="Empty banner placeholder"
              className="banner-placeholder max-w-4xl w-full max-h-[300px] h-[30vh] min-h-[150px] rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-blue-400 flex flex-col items-center justify-center text-white select-none shadow-lg shadow-indigo-300/50 p-8 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="banner-icon w-16 h-16 mb-[100px] stroke-current stroke-2 fill-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              {/* <p className="banner-text font-semibold text-xl tracking-wide drop-shadow-md">
                Your banner will appear here
              </p> */}
            </main>
          )}
        </div>
        <div className="absolute top-1 right-3 z-10">
          <div
            className="absolute -left-6 top-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            onClick={() => document.getElementById("banner_image")?.click()}
          >
            <Camera size={16} className="text-gray-600" />
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
      <div className="flex justify-between">
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

      {/* Spacer below for overlap */}
      <div className="h-[60px]" />

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label={translate("Store_Name")}
            name="store_name"
            type="text"
            placeholder={translate("Enter_Store_Name")}
          />
        </div>
        <div className="col-span-2">
          <Input
            label={translate("Tags")}
            name="tags"
            type="renderTagInputUpdated"
            placeholder={translate("Enter_your_tags")}
          />
        </div>
        <div className="md:col-span-1 col-span-2">
          <Input
            label={translate("Category")}
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
        <div className="col-span-2 ">
          <Input
            label={translate("Store_Description")}
            name="store_description"
            type="editor"
            rows={4}
            placeholder="I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!"
          />
        </div>
      </div>
    </div>
  );
}
