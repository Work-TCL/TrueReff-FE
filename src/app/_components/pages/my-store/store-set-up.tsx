"use client";
import { Button } from "@/components/ui/button";
import Input from "@/app/_components/ui/form/Input";
import Select from 'react-select';
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { translate } from "../../../../lib/utils/translate";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStoreSchema, ICreateStoreSchema } from "@/lib/utils/validations";
import { ICreateStoreRequest } from "@/lib/types-api/my-store";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import { createStore } from "@/lib/web-api/my-store";
import { fileUploadLimitValidator } from "@/lib/utils/constants";

interface IAddProductDetailProps {
  isDetailView?: boolean;
}
const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    borderRadius: "12px",
    height: '52.5px'
  })
};
export default function StoreSetUp(props: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const methods = useForm<ICreateStoreSchema>({
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      category: [],
      profile_image: null,
      banner_image: null,
    },
    resolver: yupResolver(createStoreSchema),
    mode: "onSubmit",
  });

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setCategories(data);
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  const onSubmit = async (data: ICreateStoreSchema) => {
    setLoading(true);

    try {
      // const payload: ICreateStoreRequest = {
      const payload: any = {
        name: data.name,
        description: data.description,
        category: data.category.map((v) => v.value),
        tags: data.tags || [],
      };

      if (bannerFile) {
        payload.banner_image = bannerFile;
      }
      if (profileFile) {
        payload.profile_image = profileFile;
      }

      const response: any = await createStore(
        payload
      );
      if (response?.status === 201) {

      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedCategories(selectedIds);

    const optionsSubCategory = categories.filter((ele) =>
      selectedIds.includes(ele?.parentId || "")
    );
    setSubCategory(optionsSubCategory);
  }
  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
    }
  };
  return (
    <div className="flex flex-col gap-2 lg:gap-5 h-full p-2 lg:p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full h-full overflow-auto flex-1 flex flex-col gap-3 relative"
        >
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="md:text-xl text-base text-500">
              {translate("Add_Details_For_Store_Set_Up")}
            </div>
            <div className="flex gap-[10px]">
              <Button type="button" variant="outline" className="w-[140px] rounded-[12px]">
                {translate("Cancel")}
              </Button>
              <Button
                type='submit'
                variant="secondary"
                className="text-white w-[140px] rounded-[12px]"
              >
                {translate("Save")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            <div className="flex bg-white rounded-xl col-span-2 flex-col gap-2 lg:w-1/2 p-4">
              <div className="text-sm lg:text-lg">{translate("Banner_Image")}</div>
              <div className="text-sm text-gray-500">
                {translate("Store_Banner_Image")}
              </div>
              <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="/assets/product/image-square.svg"
                    className="w-[50px] h-[50px]"
                  />
                  <div className="text-gray-500">
                    {translate("Drag_and_drop_image_here,_or_click_Add_Image")}
                  </div>
                  <input
                    type="file"
                    id="banner-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "banner")} />
                  <Button type="button" variant="outline" onClick={() => {
                    document.getElementById("banner-image")?.click();
                  }}>{translate("Add_Image")}</Button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2 lg:w-1/2  p-4">
              <div className="text-sm lg:text-lg">{translate("Profile_Image")}</div>
              <div className="text-sm text-gray-500">
                {translate("Store_Profile_Image")}
              </div>
              <div className="flex justify-center items-center border rounded-lg p-5">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="/assets/product/image-square.svg"
                    className="w-[50px] h-[50px]"
                  />
                  <div className="text-gray-500">
                    {translate("Drag_and_drop_image_here,_or_click_Add_Image")}
                  </div>
                  <input
                    type="file"
                    id="profile-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, "profile")}
                  />
                  <Button type="button" variant="outline" onClick={() => {
                    document.getElementById("profile-image")?.click();
                  }}>{translate("Add_Image")}</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-4 gap-2">
            <div className="text-sm lg:text-lg">{translate("Category")}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1 gap-1">
                <label className="text-sm text-[#7E7E80]">
                  {translate("Product_Category")}<span className="text-[red]">*</span>
                </label>
                <Select
                  name="category"
                  styles={customStyles}
                  // value={selectedCategories.map((id) => {
                  //   const match = parentCategory.find((cat) => cat._id === id);
                  //   return { value: id, label: match?.name || id };
                  // })}
                  isMulti
                  // onChange={handleSelectCategory}
                  options={parentCategory.map((ele) => ({
                    value: ele._id,
                    label: ele.name,
                  }))}
                  isOptionDisabled={() => selectedCategories.length >= 3}
                  className="basic-multi-select focus:outline-none focus:shadow-none"
                  placeholder="Product Categories"
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Tags"
                  name="tags"
                  type="tag"
                  placeholder="Enter your tags"
                />
              </div>
            </div>
            <div className="text-sm lg:text-lg">{translate("General_Information")}</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Input
                  label="Store Name"
                  name="name"
                  type="text"
                  placeholder="Men’s Style Guide & Trends"
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Store Link"
                  name="link"
                  type="text"
                  placeholder="https://my-store.com"
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Input
                  label="Store Description"
                  name="description"
                  type="textarea"
                  rows={4}
                  placeholder="I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!"
                />
              </div></div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
