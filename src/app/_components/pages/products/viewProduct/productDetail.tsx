"use client";
import React, { useState } from "react";
import { IProduct } from "./viewDetailProduct";
import { useTranslations } from "next-intl";

interface IProductInfoProps {
  productData: IProduct;
}

export function ProductInfo({ productData }: IProductInfoProps) {
  const translate = useTranslations();
  const [selectedVariant, setSelectedVariant] = useState(productData?.variants?.length > 0 ? productData?.variants[0] : {
    title: "",
    price: ""
  });
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto pr-2">

      <div>
        {/* <p className="text-gray-500 text-xs">Puma</p> */}
        <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
          {productData.name}
        </h1>
        <p className="text-gray-500 text-xs" dangerouslySetInnerHTML={{
            __html: productData?.description,
          }}/>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="sm:text-xl text-sm font-semibold text-green-600">₹{selectedVariant?.price ? selectedVariant?.price : productData?.price}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div>
          <p className="sm:text-sm text-xs text-gray-500 mb-1">
            {translate("Category")}
          </p>
          <p className="sm:text-base text-sm  font-medium text-gray-700">
            {productData.category}
          </p>
        </div>
      </div>
      {productData.tags?.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-2">{translate("Tags")}</p>
          <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
            {productData.tags.map((tag, idx) => (
              <span key={idx} className="bg-background py-1 px-2 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {productData.description && (
        <div className="border-t border-gray-200 pt-6">
          <p className="sm:text-sm text-xs text-gray-500 mb-1">
            {translate("Description")}
          </p>
          <p className="sm:text-base text-sm  text-gray-800 leading-relaxed">
            {productData.description}
          </p>
        </div>
      )}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
          {translate("Variants")}
        </h3>
        <div className="flex gap-3 sm:text-sm text-xs text-gray-700">
          {productData?.variants?.length > 0 && productData?.variants?.map((variant: any, index) => (
            <span
              key={index}
              className={`${selectedVariant?.title === variant?.title ? "bg-gray-darken text-white" : "border bg-white text-black"} py-1 px-3 rounded-full flex items-center gap-2 cursor-pointer hover:bg-gray-darken/80 transition-colors`}
              onClick={() => setSelectedVariant({ title: variant?.title, price: variant?.price })}
            >
              {variant?.title}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-3">
          {translate("Creator_Commission")}
        </h3>
        <div className="space-y-2 sm:text-sm text-xs text-gray-700">
          <div className="flex justify-between">
            <span>{translate("Commission")}</span>
            <span>{productData?.commission}{productData?.commission_type === "FIXED_AMOUNT" ? "₹" : "%" }</span>
          </div>
          <div className="flex justify-between">
            <span>{translate("free_promotional_product")}</span>
            <span className="text-gray-500">{productData?.freeProduct?"Yes":"No"}</span>
          </div>
        </div>
      </div>
      {productData?.discount && <div className="border-t border-gray-200 pt-6">
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
