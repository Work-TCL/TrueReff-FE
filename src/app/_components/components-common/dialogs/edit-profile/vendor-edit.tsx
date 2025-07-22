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
  allowedImageTypes,
  businessTypes,
  cities,
  fileUploadLimitValidator,
  imageAccept,
  indianStates,
} from "@/lib/utils/constants";
import Select from "react-select";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { getCategories } from "@/lib/web-api/auth";
import { Camera,User } from "lucide-react";
import { useSession } from "next-auth/react";
import imageCompression from 'browser-image-compression';

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
   const { update } = useSession();
  const { setVendorData } = useVendorStore();
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(profile?.banner_image || "");
  const [profilePreview, setProfilePreview] = useState<string>(
    profile?.profile_image || ""
  );
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);
  const initialState = {
    state: profile?.state ?? "",
    city: profile?.city ?? "",
    type_of_business: profile?.type_of_business ?? "",
    category: categories.filter(ele => profile?.category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id })),
    sub_category: categories.filter(ele => profile?.sub_category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id }))
  };
  const [formState, setFormState] = useState(initialState);
  useEffect(() => {
    if (profile) {
      setFormState({
        state: profile?.state, city: profile?.city, type_of_business: profile?.type_of_business, category: categories.filter(ele => profile?.category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id })),
        sub_category: categories.filter(ele => profile?.sub_category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id }))
      });
      methods.setValue("sub_category", categories.filter(ele => profile?.sub_category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id })))
      methods.setValue("category", categories.filter(ele => profile?.category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id })))
    }
  }, [profile, categories]);
  const schema = vendorProfileUpdateSchema;
  const methods = useForm<IVendorProfileUpdateSchema>({
    defaultValues: {
      business_name: profile?.business_name,
      zip_code: profile?.pin_code,
      address: profile?.address,
      type_of_business: profile?.type_of_business,
      website: profile?.website,
      state: profile?.state,
      city: profile?.city,
      profile_image: profile?.profile_image,
      banner_image: profile?.banner_image,
      category: categories.filter(ele => profile?.category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id })),
      sub_category: categories.filter(ele => profile?.sub_category.includes(ele?._id))?.map(el => ({ label: el?.name, value: el?._id }))
    },
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: IVendorProfileUpdateSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: any = {
        business_name: data?.business_name,
        zip_code: data?.zip_code,
        address: data?.address,
        type_of_business: data?.type_of_business,
        website: data?.website,
        state: data?.state,
        city: data?.city,
        category: data?.category?.map(el => el?.value),
        sub_category: (data?.sub_category && data?.sub_category?.length > 0) ? data?.sub_category?.map(el => el?.value) : []
      };

      if (profileFile) {
        payload["profile_image"] = profileFile;
      }
      if (bannerFile) {
        payload["banner_image"] = bannerFile;
      }
      let response: any = await axios.patch("/auth/vendor", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.data) {
        response = response?.data;
      }
      if (response?.status === 200) {
        await update({
          user: {
            vendor: response?.data,
          },
        });
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?.accountId,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          completed_step: response?.data?.completed_step,
          contacts: response?.data?.contacts,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          pin_code: response?.data?.pin_code,
          type_of_business: response?.data?.type_of_business,
          website: response?.data?.website,
          state: response?.data?.state,
          city: response?.data?.city,
          address: response?.data?.address,
          profile_image: response?.data?.profile_image,
          banner_image: response?.data?.banner_image,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          gst_certificate: response?.data?.gst_certificate,
          gst_number: response?.data?.gst_number,
          pan_number: response?.data?.pan_number,
          channelConfig: response?.data?.channelConfig,
          channelId: response?.data?.channelId,
          channelStatus: response?.data?.channelStatus,
          channelType: response?.data?.channelType,
          status: response?.data?.status,
        })
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

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0,type: "vendor" });
      let data = response?.data?.data;
      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
    } catch (error) { }
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

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement> | any,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      methods.setError(type === "banner" ? "banner_image" : "profile_image", {
        type: "manual",
        message: "Only JPG and PNG images are allowed.",
      });
      return;
    }

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1, // Compress to 1MB or less
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });


    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(compressedFile);
      setProfilePreview(previewURL);
      methods.setValue("profile_image", previewURL);
      methods.setError("profile_image", {
        type: "manual",
        message: "",
      });
    } else {
      setBannerFile(compressedFile);
      setBannerPreview(previewURL);
      methods.setValue("banner_image", previewURL);
      methods.setError("banner_image", {
        type: "manual",
        message: "",
      });
    }
  };
  const handleOnSelect = (value: any, name: any) => {
    setFormState({ ...formState, [name]: value });
    if (name === "state") {
      setFormState({ ...formState, [name]: value, city: "" });
      methods.setValue("city", "");
    }
    methods.setValue(name, value);
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
          <div
              className="flex justify-center col-span-2 cursor-pointer"
            >
              <div onClick={() => document.getElementById("profile-image")?.click()} className="relative w-[130px] h-[130px] rounded-full border-4 border-white  bg-white shadow-lg flex items-center justify-center">
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
                  capture={false}
                  accept={imageAccept}
                  onChange={(e) => handleImageSelect(e, "profile")}
                />
              </div>
            </div>
          <div className="col-span-2 flex justify-between">
            {Boolean(get(methods.formState.errors, "profile_image")) && (
              <span className="text-red-600 text-sm p-2 block">
                {methods.formState.errors["profile_image"]?.message}
              </span>
            )}
          </div>
          <div className="col-span-2 mt-2">
            <Input
              label={translate("Business_Name")}
              name="business_name"
              type="text"
              placeholder={translate("Enter_your_Business_Name_or_Company Name")}
              autoFocus
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
              menuPortalTarget={null}
              max={1}
              autoFocus={false}
            />
          </div>
          <div className="md:col-span-1 col-span-2">
            <Input
              label={translate("Sub_category")}
              required={false}
              placeholder={translate("Select_Sub_Category")}
              name="sub_category"
              type="multiSelectWithTags"
              options={subCategory.map((ele) => ({
                value: ele?._id,
                label: ele?.name,
              }))}
              menuPortalTarget={null}
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
              name="zip_code"
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
          <div className="pt-6 col-span-2 sticky bottom-0 ">
            <Button type="submit" loading={loading}>
              {translate("Save")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
