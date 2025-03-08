"use client";
import Input from "@/app/_components/ui/form/Input";
import React from "react";
import { translate } from "@/lib/utils/translate";
import { Button } from "@/components/ui/button";

export default function ProfileSetup() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label="Profile Title"
          name="profile_title"
          type="text"
          placeholder="ABC"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Long Description"
          name="long-description"
          type="textarea"
          rows={2}
          placeholder="ABC"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Short Description"
          name="short-description"
          type="text"
          placeholder="ABC"
        />
      </div>
      <div className="col-span-2">
        <Input label="Tags" name="tags" type="tag" placeholder="#ABC" />
        {/* <Input label="Tags" name="tags" type="text" placeholder="#ABC" /> */}
      </div>
      <div className="flex col-span-2 gap-5 text-[18px]">
        {[1, 2, 3, 4].map((ele) => (
          <div>#MensFashion</div>
        ))}
      </div>
      <div className="col-span-1">
        <Input
          label={translate("Category")}
          placeholder={translate("Select_category")}
          name="category"
          type="select"
          options={[
            {
              label: "Tags",
              value: "",
            },
            {
              label: "Apple",
              value: "Apple",
            },
            {
              label: "Banana",
              value: "Banana",
            },
            {
              label: "Blueberry",
              value: "Blueberry",
            },
            {
              label: "Grapes",
              value: "Grapes",
            },
            {
              label: "Pineapple",
              value: "Pineapple",
            },
          ]}
        />
      </div>
      <div className="col-span-1">
        <Input
          label={translate("Sub_category")}
          placeholder={translate("Select_sub_category")}
          name="sub_category"
          type="select"
          options={[
            {
              label: "Tags",
              value: "",
            },
            {
              label: "Apple",
              value: "Apple",
            },
            {
              label: "Banana",
              value: "Banana",
            },
            {
              label: "Blueberry",
              value: "Blueberry",
            },
            {
              label: "Grapes",
              value: "Grapes",
            },
            {
              label: "Pineapple",
              value: "Pineapple",
            },
          ]}
        />
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm">{translate("Profile_Image")}</div>
        <div className="flex justify-center items-center border rounded-lg p-5">
          <div className="flex flex-col w-full gap-4">
            <div className="flex justify-center">
              <img
                src="/assets/product/image-square.svg"
                className="w-[50px] h-[50px]"
              />
            </div>
            <Button variant="outline" className="w-full">
              {translate("Upload_your_photo")}
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm">{translate("Banner_Image")}</div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-center items-center border border-dashed rounded-lg p-5">
            <div className="flex flex-col items-center gap-4">
              <img
                src="/assets/product/image-square.svg"
                className="w-[50px] h-[50px]"
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
