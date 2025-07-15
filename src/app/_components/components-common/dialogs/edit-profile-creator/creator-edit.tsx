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
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { useCreatorStore } from "@/lib/store/creator";
import { getCategories, updateCreator } from "@/lib/web-api/auth";
import { ICategoryData, IPutUpdateCreatorRequest } from "@/lib/types-api/auth";
import {
  allowedImageTypes,
  cities,
  fileUploadLimitValidator,
  gender,
  imageAccept,
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
    borderRadius: "12px",
  }),
  options: (base: any) => ({
    ...base,
    zIndex: 999,
  }),
};

export default function EditCreatorForm({ onClose }: { onClose: any }) {
  const translate = useTranslations();
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
  const initialState = {
    state: creator?.state ?? "",
    city: creator?.city ?? "",
    gender: creator?.gender ?? "",
    dob: new Date(creator?.dob)?.toISOString()?.split("T")[0]??""
  };
  const [formState, setFormState] = useState(initialState);
  useEffect(() => {
    if (creator) {
      setFormState({
        state: creator?.state,
        city: creator?.city,
        gender: creator?.gender,
        dob: new Date(creator?.dob)?.toISOString()?.split("T")[0]
      });
    }
  }, [creator]);
  const schema = creatorProfileUpdateSchema;
  const methods = useForm<ICreatorProfileUpdateSchema>({
    defaultValues: {
      full_name: creator?.full_name,
      user_name: creator?.user_name,
      phone: creator?.phone,
      profile_image: creator?.profile_image || "",
      state: creator?.state || "",
      city: creator?.city || "",
      gender: creator?.gender || "",
      dob: new Date(creator?.dob).toLocaleDateString() || "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: ICreatorProfileUpdateSchema) => {
    setLoading(true);
    try {
      // ("use server");
      const payload: IPutUpdateCreatorRequest = {
        user_name: data.user_name,
        full_name: data.full_name,
        profile_image: profileFile,
        state: data?.state,
        city: data?.city,
        gender: data?.gender,
        dob: data?.dob,
      };

      const response: any = await updateCreator(payload);

      if (response.status === 200) {
        toast.success(response?.message || "Profile Update Successfully");
        const res = response?.data?.data;
        setCreatorData("creator", {
          creatorId: res?._id,
          accountId: res?.accountId,
          full_name: res?.full_name,
          user_name: res?.user_name,
          email: res?.email,
          phone: res?.phone,
          dob: res?.dob,
          gender: res?.gender,
          state: res?.state,
          city: res?.city,
          category: res?.category,
          sub_category: res?.sub_category,
          tags: res?.tags,
          channels: res?.channels,
          completed_step: res?.completed_step,
          status: res?.status,
          createdAt: res?.createdAt,
          updatedAt: res?.updatedAt,
          completed: res?.completed,
          instagram_link: res?.instagram_link,
          youtube_link: res?.youtube_link,
          banner_image: res?.banner_image,
          profile_image: res?.profile_image,
          store_description: res?.store_description,
          store_name: res?.store_name,
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

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;
    if (!allowedImageTypes.includes(file.type)) {
      methods.setError("profile_image", {
        type: "manual",
        message: "Only JPG and PNG images are allowed.",
      });
      return;
    } else {
      methods.setError("profile_image", {
        type: "manual",
        message: "",
      });
    }

    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
    }
  };

  const handleDropImage = async (
    e: React.DragEvent<HTMLDivElement>,
    type: "profile" | "banner"
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      methods.setError("profile_image", {
        type: "manual",
        message: "Only JPG and PNG images are allowed.",
      });
      return;
    }

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

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  );
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col text-left gap-3 w-full"
        >
          <div className="grid grid-cols-2 text-left gap-3 w-full overflow-y-auto max-h-[60vh]">
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
            <Input
              label={translate("FullName")}
              name="full_name"
              type="text"
              placeholder="John Doe"
            />
          </div>
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
            <Input
              label={translate("Username")}
              name="user_name"
              type="text"
              placeholder="john_doe_90"
            />
          </div>
          <div className="col-span-2">
            <Input
              label={translate("PhoneNumber")}
              name="phone"
              type="phone"
              placeholder="XXXXX XXXXX"
              disabled
            />
          </div>
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
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
                    label: formState.state
                      ? formState.state
                      : translate("Select_State"),
                  },
                ]}
                onChange={(value) => handleOnSelect(value?.value, "state")}
                options={indianStates?.map((ele) => ({
                  value: ele,
                  label: ele,
                }))}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder={translate("Select_State")}
              />
              {Boolean(get(methods.formState.errors, "state")) && (
                <span className="text-red-600 text-sm p-2 block">
                  {methods.formState.errors["state"]?.message}
                </span>
              )}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
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
                    label: formState.city
                      ? formState.city
                      : translate("selectCity"),
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
          <div className="col-span-1">
            <div className="flex flex-col">
              <span className="mb-1 text-sm text-gray-500 font-semibold">
                {translate("Gender")}
                <span className="text-red-500">*</span>
              </span>
              <Select
                styles={customStyles}
                value={[
                  {
                    value: formState.gender,
                    label: formState.gender
                      ? formState.gender
                      : translate("SelectGender"),
                  },
                ]}
                onChange={(value) => handleOnSelect(value?.value, "gender")}
                options={gender?.map((ele) => ({ value: ele, label: ele }))}
                className="basic-multi-select focus:outline-none focus:shadow-none"
                placeholder={translate("SelectGender")}
              />
              {Boolean(get(methods.formState.errors, "gender")) && (
                <span className="text-red-600 text-sm p-2 block">
                  {methods.formState.errors["gender"]?.message}
                </span>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex flex-col">
                <span className="mb-1 text-sm text-gray-500 font-semibold">
                  {translate("Date_of_Birth")}
                  <span className="text-red-500">*</span>
                </span>
                <input
                  onChange={(e: any) => handleOnSelect(e.target?.value, "dob")}
                  className="h-[54px] border rounded-xl p-2"
                  type="date"
                  name="dob"
                  value={formState?.dob}
                  min={formatDate(minDate)} // ✅ 100 years ago
                  max={formatDate(maxDate)} // ✅ 18 years ago
                  placeholder={translate("Select_date_of_birth")}
                />
                {Boolean(get(methods.formState.errors, "dob")) &&
                  methods.formState.errors["dob"]?.message && (
                  <span className="text-red-600 text-sm p-2 block">
                    {methods.formState.errors["dob"]?.message}
                  </span>
                )}
            </div>
          </div>
          <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
            <div className="text-sm">{translate("Profile_Image")}</div>
            <div
                className="flex justify-center items-center border rounded-lg p-5 flex-col"
              onDrop={(e) => handleDropImage(e, "profile")}
              onClick={() => {
                document.getElementById("profile-image")?.click();
              }}
              onDragOver={(e) => e.preventDefault()}
            >
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
                  accept={imageAccept}
                  onChange={(e) => handleImageSelect(e, "profile")}
                />
                {/* <Button
                  className="w-full disabled:cursor-not-allowed"
                  onClick={() => {
                    document.getElementById("profile-image")?.click();
                  }}
                >
                  {translate("Upload_your_photo")}
                </Button> */}
              </div>
                {Boolean(get(methods.formState.errors, "profile_image")) &&
                  methods.formState.errors["profile_image"]?.message && (
                    <span className="text-red-600 text-sm p-2 block">
                      {methods.formState.errors["profile_image"]?.message}
                    </span>
                  )}
            </div>
          </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button size="small" className="w-1/3 sm:w-1/4 md:w-1/4 bg-white border text-secondary" type="button" onClick={() => onClose(true)}>
              {translate("Cancel")}
            </Button>
            <Button size="small" className="w-1/3 sm:w-1/4 md:w-1/4" type="submit" loading={loading}>
              {translate("Save")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
