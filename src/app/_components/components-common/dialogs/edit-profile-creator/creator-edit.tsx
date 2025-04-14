"use client";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  creatorProfileUpdateSchema,
  ICreatorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { translate } from "@/lib/utils/translate";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { useCreatorStore } from "@/lib/store/creator";
import { getCategories, updateCreator } from "@/lib/web-api/auth";
import { ICategoryData, IPutUpdateCreatorRequest } from "@/lib/types-api/auth";

export default function EditCreatorForm({ onClose }: { onClose: any }) {
  const { creator, setCreatorData } = useCreatorStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(
    creator?.profile_image || ""
  );
  const [bannerPreview, setBannerPreview] = useState<string>(
    creator?.banner_image || ""
  );

  const schema = creatorProfileUpdateSchema;
  const methods = useForm<ICreatorProfileUpdateSchema>({
    defaultValues: {
      full_name: creator?.full_name,
      user_name: creator?.user_name,
      phone: creator?.phone,
      title: creator.title,
      long_description: creator?.long_description,
      short_description: creator?.short_description,
      category: [],
      sub_category: [],
      banner_image: creator?.banner_image || "",
      profile_image: creator?.profile_image || "",
      tags: creator?.tags || [],
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories((prev) => {
        prev = data;
        return prev;
      });
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
      const selectedCategories: any = data
        ?.filter((ele) => ele?.parentId === null)
        .filter(
          (v) =>
            Array.isArray(creator.category) && creator.category.includes(v._id)
        )
        .map((c) => ({ label: c.name, value: c._id }));
      await methods.setValue("category", selectedCategories || []);
      reSetSubCategories(
        data || [],
        selectedCategories?.map((v: any) => v.value),
        creator.sub_category || []
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const reSetSubCategories = async (
    defaultCategories: any = [],
    defaultCategoriesId: string[] = [],
    defaultValue: string[] = []
  ) => {
    const categoriesId =
      (await methods.watch("category")?.map((v: any) => v.value)) || [];

    const optionsSubCategory = await [
      ...categories,
      ...defaultCategories,
    ].filter(
      (ele) =>
        categoriesId?.includes(ele?.parentId) ||
        defaultCategoriesId?.includes(ele?.parentId)
    );

    setSubCategory(optionsSubCategory);
    const availableSubCategoriesIds = optionsSubCategory.map((v) => v?._id);
    const defaultAvailbleSet: any = optionsSubCategory
      .filter((v) => defaultValue.includes(v?._id))
      .map((v) => ({ label: v.name, value: v._id }));

    const subCategoroies = [
      ...(methods.watch("sub_category") || []),
      ...(Array.isArray(defaultAvailbleSet) ? defaultAvailbleSet : []),
    ];
    methods.setValue(
      "sub_category",
      subCategoroies.filter((v: any) =>
        availableSubCategoriesIds.includes(v.value)
      )
    );
  };

  useEffect(() => {
    reSetSubCategories();
  }, [methods.watch("category")?.length]);

  console.log("errors", methods.formState.errors, methods.watch());

  const onSubmit = async (data: ICreatorProfileUpdateSchema) => {
    setLoading(true);
    try {
      // ("use server");
      const payload: IPutUpdateCreatorRequest = {
        user_name: data.user_name,
        full_name: data.full_name,
        phone: data.phone,
        title: data.title,
        long_description: data.long_description,
        short_description: data.short_description,
        category: data.category.map((v) => v.value) || [],
        sub_category: data.sub_category.map((v) => v.value) || [],
        tags: data.tags || [],
        profile_image: profileFile,
        banner_image: bannerFile,
      };

      const response: any = await updateCreator(payload);
      console.log("response", response);

      if (response.status === 200) {
        toast.success(response?.message || "Profile Update Successfully");
        const res = response?.data?.data;
        setCreatorData("creator", {
          creatorId: res?._id,
          accountId: res?.accountId,
          full_name: res?.full_name,
          user_name: res?.user_name,
          title: res?.title,
          phone: res?.phone,
          banner_image: res?.banner_image,
          profile_image: res?.profile_image,
          category: res?.category,
          sub_category: res?.sub_category,
          tags: res?.tags,
          channels: res?.channels,
          completed: res?.completed,
          short_description: res?.short_description,
          long_description: res?.long_description,
        });
        onClose && onClose(true);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
    }
  };

  console.log("profile images", bannerFile, profileFile);

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-2 text-left gap-3 w-full relative"
        >
          <div className="col-span-1">
            <Input
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="John Doe"
            />
          </div>
          <div className="col-span-1">
            <Input
              label="Username"
              name="user_name"
              type="text"
              placeholder="john_doe_90"
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Phone Number"
              name="phone"
              type="phone"
              placeholder="+91 864 542 2548 "
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Profile Title"
              name="title"
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
            />
          </div>
          <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
            <div className="text-sm">{translate("Profile_Image")}</div>
            <div className="flex justify-center items-center border rounded-lg p-5">
              <div className="flex flex-col w-full gap-4">
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
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, "profile")}
                />
                <Button
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
                className="flex justify-center items-center border border-dashed rounded-lg p-5"
                onClick={() => {
                  document.getElementById("banner_image")?.click();
                }}
              >
                <div className="flex flex-col items-center gap-4">
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
                    className="hidden"
                    accept="image/*"
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
          <div className="py-6 col-span-2 sticky bottom-0 bg-white bg-white">
            <Button type="submit" loading={loading}>
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
