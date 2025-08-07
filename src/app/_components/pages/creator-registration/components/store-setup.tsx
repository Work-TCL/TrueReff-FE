"use client";
import Input from "@/app/_components/ui/form/Input";
import React, { useEffect, useState } from "react";
import { Camera, Info, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { get } from "lodash";
import { useCreatorStore } from "@/lib/store/creator";
import ToolTip from "@/app/_components/components-common/tool-tip";
import TagInput from "@/components/ui/tag-input";
import { imageAccept } from "@/lib/utils/constants";

export interface ICategoryData {
  _id: string;
  name: string;
  parentId: {
    _id: string;
    name: string;
    parentId: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface IProps {
  handleImageSelect: any;
  profilePreview: any;
  bannerPreview: any;
  methods: any;
  categories: ICategoryData[];
  showTrending: boolean;
  setShowTrending: (value: boolean) => void;
  isRegistration?: boolean;
}

export default function StoreSetup({
  handleImageSelect,
  bannerPreview,
  profilePreview,
  methods,
  categories,
  showTrending,
  setShowTrending,
  isRegistration = false,
}: IProps) {
  const translate = useTranslations();
  const { creator } = useCreatorStore();
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);
  useEffect(() => {
    setParentCategory(categories?.filter((ele: ICategoryData) => ele?.parentId === null));
  }, [categories]);

  useEffect(() => {
    (async () => {
      const categoriesId =
        (await methods.watch("category")?.map((v: any) => v.value)) || [];

      const optionsSubCategory = await categories.filter((ele: ICategoryData) =>
        categoriesId?.includes(ele?.parentId?._id)
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
  }, [methods.watch("category"), creator?.category]);
  const handleTagChange = (value:string[]) => {
    methods.setValue("tags",value);
  }
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
            <img
              src={"/assets/banner-image.png"}
              className="w-full h-full object-cover"
              alt="Banner"
            />
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
            accept={imageAccept}
            className="hidden"
            capture={false} 
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
              accept={imageAccept}
              capture={false} 
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
        <div className={"col-span-2"}>
          <Input
            label={translate("Store_Name")}
            name="store_name"
            type="text"
            placeholder={translate("Enter_Store_Name")}
            lableClassName="text-md font-[400]"
          />
        </div>
        <div className="col-span-2">
          <TagInput value={methods.watch("tags")} onChange={handleTagChange} error={methods.formState.errors["tags"]?.message}/>
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
            max={1}
            lableClassName="text-md font-[400]"
          />
        </div>
        <div className="md:col-span-1 col-span-2">
          <Input
            label={translate("Sub_category")}
            placeholder={translate("Select_Sub_Category")}
            name="sub_category"
            required={false}
            type="multiSelectWithTags"
            options={subCategory.map((ele) => ({
              value: ele?._id,
              label: ele?.name,
            }))}
            autoFocus={false}
            lableClassName="text-md font-[400]"
          />
        </div>
        <div className="col-span-2 ">
          <Input
            label={translate("Store_Description")}
            name="store_description"
            type="textarea"
            rows={4}
            placeholder={translate("Enter_your_store_description")}
            lableClassName="text-md font-[400]"
          />
        </div>
      </div>
    </div>
  );
}
