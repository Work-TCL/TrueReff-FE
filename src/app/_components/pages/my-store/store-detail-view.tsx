"use client";
import React from "react";
import { translate } from "../../../../lib/utils/translate";
import { Button } from "@/components/ui/button";
import { useCreatorStore } from "@/lib/store/creator";
import { useRouter } from "next/navigation";

export default function StoreDetailView({ store,handleOnEdit }: any) {
  const router = useRouter();
  const {creator} = useCreatorStore();
  return (
    <div className="flex flex-col gap-2 lg:gap-5 h-full p-2 lg:p-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="md:text-xl text-base text-500">
          {translate("Store_Overview")}
        </div>
        {creator?.creatorId === store?.creatorId && <div className="flex gap-[10px]">
          <Button
            type='button'
            variant="secondary"
            className="text-white w-[140px] rounded-[12px]"
            onClick={() => {
              router.push("/creator/my-store/store-setup")
              handleOnEdit && handleOnEdit();
            }}
          >
            {translate("Edit")}
          </Button>
        </div>}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex bg-white rounded-xl col-span-2 flex-col gap-2 lg:w-1/2 p-4">
          <div className="text-sm lg:text-lg">{translate("Banner_Image")}</div>
          <div className="text-sm text-gray-500">
            {translate("Store_Banner_Image")}
          </div>
          <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
            <img
              src={store?.banner_image || "/assets/product/image-square.svg"}
              className="w-full max-h-[200px] object-contain"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2 lg:w-1/2 p-4">
          <div className="text-sm lg:text-lg">{translate("Profile_Image")}</div>
          <div className="text-sm text-gray-500">
            {translate("Store_Profile_Image")}
          </div>
          <div className="flex justify-center items-center border rounded-lg p-5">
            <img
              src={store?.profile_image || "/assets/product/image-square.svg"}
              className="w-[200px] h-[200px] rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-xl p-4 gap-2">
        <div className="text-sm lg:text-lg">{translate("Category")}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-3">
          <div>
            <label className="text-sm text-[#7E7E80]">
              {translate("Product_Category")}
            </label>
            <div className="text-base font-medium mt-1">
              {store?.category?.join(", ") || "-"}
            </div>
          </div>
          <div>
            <label className="text-sm text-[#7E7E80]">
              {translate("Tags")}
            </label>
            <div className="text-base font-medium mt-1">
              {store?.tags?.join(", ") || "-"}
            </div>
          </div>
        </div>

        <div className="text-sm lg:text-lg">
          {translate("General_Information")}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#7E7E80]">
              {translate("Store_Name")}
            </label>
            <div className="text-base font-medium mt-1">
              {store?.name || "-"}
            </div>
          </div>
          <div>
            <label className="text-sm text-[#7E7E80]">
              {translate("Store_Link")}
            </label>
            <div className="text-base font-medium mt-1 text-blue-600">
              {store?.link || "-"}
            </div>
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm text-[#7E7E80]">
              {translate("Store_Description")}
            </label>
            <p className="text-base font-medium mt-1">
              {store?.description || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
