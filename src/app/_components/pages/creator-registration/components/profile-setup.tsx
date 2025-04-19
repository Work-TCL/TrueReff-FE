"use client";
import Input from "@/app/_components/ui/form/Input";
import React, { useEffect, useState } from "react";
import { translate } from "@/lib/utils/translate";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/web-api/auth";
import { useFormContext } from "react-hook-form";
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
}

export default function ProfileSetup({
  handleImageSelect,
  bannerPreview,
  profilePreview,
}: IProps) {
  const methods = useFormContext();
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState([]);

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    // if (methods.watch("category")) {
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
    // methods.setValue(
    //   "sub_category",
    //   methods
    //     .watch("sub_category")
    //     ?.filter((v) =>
    //       optionsSubCategory?.map((n: any) => n.value).includes(v.value)
    //     ) || []
    // );
    // }
  }, [methods.watch("category")?.length]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label="Profile Title"
          name="profile_title"
          type="text"
          placeholder="Men’s Style Guide & Trends"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Long Description"
          name="long_description"
          type="textarea"
          rows={2}
          placeholder="I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Short Description"
          name="short_description"
          type="text"
          placeholder="Helping men stay stylish with the latest fashion trends."
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Tags"
          name="tags"
          type="tag"
          placeholder="Enter your tags"
        />
        {/* <Input label="Tags" name="tags" type="text" placeholder="#ABC" /> */}
      </div>
      <div className="md:col-span-1 col-span-2">
        <Input
          label={translate("Category")}
          placeholder={translate("Fashion_Beauty")}
          name="category"
          type="select-multiple"
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
          placeholder={translate("Men_Fashion")}
          name="sub_category"
          type="select-multiple"
          options={subCategory.map((ele) => ({
            value: ele?._id,
            label: ele?.name,
          }))}
          autoFocus={false}
        />
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm">{translate("Profile_Image")}</div>
        <div className="flex justify-center items-center border rounded-lg p-5">
          <div className="flex flex-col w-full gap-4 relative">
            <div className="flex justify-center">
              <img
                src={
                  profilePreview ||
                  methods.watch("profile_image") ||
                  "/assets/product/image-square.svg"
                }
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
            <Button
              variant="outline"
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
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm">{translate("Banner_Image")}</div>
        <div className="flex flex-col gap-1">
          <div
            className="flex justify-center items-center border border-dashed rounded-lg p-5 relative"
            onClick={() => {
              document.getElementById("banner_image")?.click();
            }}
          >
            <div className="flex flex-col items-center gap-4 relative">
              <img
                src={
                  bannerPreview ||
                  methods.watch("banner_image") ||
                  "/assets/product/image-square.svg"
                }
                className="w-full max-h-[200px] object-cover rounded-lg"
              />
              <input
                type="file"
                id="banner_image"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleImageSelect(e, "banner")}
              />
              <div className="text-[#656466]">
                {translate("Upload_Documents")}
              </div>
              <div className="text-[12px] text-[#89858C]">
                {translate("Upload_Documents_INFO")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
