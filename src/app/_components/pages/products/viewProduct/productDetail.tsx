"use client";
import React, { useState } from "react";
import { IProduct } from "./viewDetailProduct";
import { useTranslations } from "next-intl";
import { IndianRupee, LinkIcon } from "lucide-react";
import ToolTip from "@/app/_components/components-common/tool-tip";
import { usePathname } from "next/navigation";
import { useCreatorStore } from "@/lib/store/creator";

interface IProductInfoProps {
  productData: IProduct;
  channelType: string | null;
  handleCopyLink?: () => void; // Optional prop for handling link copy
}

export function ProductInfo({ productData,channelType, handleCopyLink }: IProductInfoProps) {
  const translate = useTranslations();
  const pathName = usePathname();
  const {creator} = useCreatorStore();
  const [selectedVariant, setSelectedVariant] = useState(productData?.variants?.length > 0 ? productData?.variants[0] : {
    title: "",
    price: "",
    image: ""
  });
  const getVariantTypes = (attributes:any[]) => {
    let attr = attributes?.length > 0 ? attributes?.map((ele:any) => {
      return ele?.name?.includes("pa_") ? ele?.name?.split("_")[1] : ele?.name;
    }) :[];
    return attr.join("/");
  }
  
  return (
    <div className="flex flex-1 flex-col gap-3 md:gap-6 p-1 md:p-6 overflow-auto pr-2">

      <div>
        {/* <p className="text-gray-500 text-xs">Puma</p> */}
        <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
          {productData.name} {((!pathName.includes("/creators/") && creator?.creatorId)) && (
              <ToolTip content={<div className="text-sm font-normal">Copy Product Link</div>} delayDuration={1000}><LinkIcon className="ml-1 text-primary-color cursor-pointer" onClick={() => handleCopyLink && handleCopyLink()} /></ToolTip>
            )}
        </h1>
        <p dangerouslySetInnerHTML={{
          __html: productData?.description
        }} className="text-gray-500 text-xs"/>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="flex items-center sm:text-xl text-sm font-semibold text-green-600"><IndianRupee className="size-[14] sm:size-[16] md:size-[18] "/>{selectedVariant?.price ? selectedVariant?.price : productData?.price}</span>
        </div>
      </div>
      {productData.category && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-2 md:pt-4">
        <div>
          <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-1">
            {translate("Category")}
          </h3>
          <p className="sm:text-base text-xs  font-medium text-gray-700">
            {productData.category}
          </p>
        </div>
      </div>}
      {productData?.tags?.length > 0 && (
        <div className="border-t border-gray-200 pt-2 md:pt-4">
          <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-1">{translate("Tags")}</h3>
          <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
            {productData?.tags?.map((tag, idx) => (
              <span key={idx} className="bg-background py-1 px-2 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {productData.description && (
        <div className="border-t border-gray-200 pt-2 md:pt-4">
          <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-1">
            {translate("Description")}
          </h3>
          <p dangerouslySetInnerHTML={{
          __html: productData?.description
        }} className="sm:text-base text-xs  text-gray-800 leading-relaxed"/>
        </div>
      )}
      {productData?.variants?.length > 0 && <div className="border-t border-gray-200 pt-2 md:pt-4">
        <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-2">
          {translate("Variants")}{channelType === "wordpress" ? <span className="text-xs">{` (${getVariantTypes(productData?.attributes??[])})`}</span> : ""}
        </h3>
        <div className="flex flex-wrap gap-2 md:gap-3 sm:text-sm text-xs text-gray-700">
          {productData?.variants?.length > 0 && productData?.variants?.map((variant: any, index) => (
            <span
              key={index}
              className={`${selectedVariant?.title === variant?.title ? "bg-gray-darken text-white" : "border bg-white text-black"} py-1 px-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-darken/80 hover:text-white transition-colors`}
              onClick={() => setSelectedVariant({ title: variant?.title, price: variant?.price,image: variant?.image  })}
            >
              {variant?.title}
            </span>
          ))}
        </div>
      </div>}
      <div className="border-t border-gray-200 pt-2 md:pt-4">
        <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-3">
          {translate("Creator_Commission")}
        </h3>
        <div className="space-y-2 sm:text-sm text-xs text-gray-700">
          <div className="flex justify-between">
            <span>{translate("Commission")}</span>
            <span className="flex items-center">{productData?.commission_type === "FIXED_AMOUNT" ? <IndianRupee className="size-[11] md:size-[14] "/> : ""}{productData?.commission}{productData?.commission ? productData?.commission_type === "FIXED_AMOUNT" ? "" : "%": "NA" }</span>
          </div>
          <div className="flex justify-between">
            <span>{translate("free_promotional_product")}</span>
            <span className="text-gray-500">{productData?.freeProduct?"Yes":"No"}</span>
          </div>
        </div>
      </div>
      {productData?.discount && <div className="border-t border-gray-200 pt-2 md:pt-4">
        <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-3">
          {translate("Additional_Offer")}
        </h3>
        <div className="space-y-2 sm:text-sm text-xs text-gray-700">
          <div className="flex justify-between">
            <span>{translate("Discount")}</span>
            <span>{productData?.discount}{productData?.discountType === "FIXED_AMOUNT" ? "₹" : "%" }</span>
          </div>
        </div>
      </div>}
    </div>
  );
}
