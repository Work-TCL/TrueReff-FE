"use client";

import React, { useState } from "react";
import { toastMessage } from "@/lib/utils/toast-message";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
interface IPhotoUploadProps {
  handleImageSelect: (value: any, name: any) => void;
  previewUrl: string;
  showType?: "circle";
  name: string;
}
export default function PhotoUpload({
  handleImageSelect,
  previewUrl,
  showType,
  name,
}: IPhotoUploadProps) {
  const translate = useTranslations();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const handleOnDrop = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 1) {
      toastMessage.info("Upload only one photo.");
    } else {
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleImageSelect({ target: { files: [file] } }, name);
      } else {
        toastMessage.info("Upload only photos");
      }
    }
    setDragActive(false);
  };
  const placeHolderImage: { [key: string]: string } = {
    profile: "/assets/product/image-square.svg",
    banner: "/assets/product/image-square.svg",
  };

  return (
    <div
      className={`flex justify-center items-center border border-dashed rounded-lg p-5 ${
        dragActive ? "border-blue bg-blue opacity-50" : "border-gray-300"
      }`}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDrop={(e) => handleOnDrop(e)}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src={previewUrl || placeHolderImage[name]}
          className={`${
            showType === "circle"
              ? "w-[200px] h-[200px] rounded-full"
              : "w-full max-h-[200px] rounded-lg"
          } object-cover ${previewUrl ? "" : "opacity-50"}`}
        />
        <div className="text-gray-500">
          {translate("Drag_and_drop_image_here,_or_click_Add_Image")}
        </div>
        <input
          name={name}
          type="file"
          capture={false} 
          id={`${name}_image`}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageSelect(e, name)}
        />
        <Button
          type="button"
          className="text-white"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById(`${name}_image`)?.click();
          }}
        >
          {translate("Add_Image")}
        </Button>
      </div>
    </div>
  );
}
