"use client"
import React, { useState } from "react";
import { translate } from "@/lib/utils/translate";
import { useVendorStore } from "@/lib/store/vendor";
import Button from "@/app/_components/ui/button";
import UtmLinkForm from "../../components-common/dialogs/utm-link";

export default function BargainingDetailView({productData}:any) {
  const {vendor} = useVendorStore();
  const [isUTMView,setIsUTMView] = useState<boolean>(false)
  
  const openUtmForm = () => {
    setIsUTMView(prev => !prev);
  }
  return (
    <div className="flex flex-col gap-5 overflow-hidden h-full">
      <div className="flex flex-col gap-5">
        <p className="text-text font-medium text-sm">Product Image</p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3 overflow-auto max-h-[210px] pr-2">
            {productData?.images?.length > 0 &&
              productData?.images.map((img:string, index:number) => (
                <div
                  key={index}
                  className="border border-border rounded-2xl p-2"
                >
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={200}
                    height={185}
                    className="rounded-md object-contain w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 overflow-auto pr-3">
        <p className="text-text font-medium text-sm">General Information</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Name")}
            </label>
            <input
              name="product_name"
              className="p-2 border text-sm rounded-md w-full"
              value={productData?.name}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Category")}
            </label>
            <input
              className="p-2 text-sm border rounded-md w-full"
              value={productData?.category}
              disabled
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-sm text-font-grey">
              {translate("Product_Tags")}
            </label>
            <input
              className="p-2 text-sm border rounded-md w-full"
              value={productData?.tags?.join(", ")}
              disabled
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm text-font-grey">
            {translate("Description")}
          </label>
          <textarea
            rows={4}
            className="p-2 text-sm border rounded-md w-full"
            value={productData?.description}
            disabled
          />
        </div>
        <div className="flex h-[45%] flex-col w-full items-start gap-3">
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]">Base Price:</span>{" "}
              <span className="md:text-lg text-base font-normal text-text">
                ${productData?.price}
              </span>
            </p>

            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">No discount</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">0</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Tax Class: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">Tax Free</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> VAT Amount: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">12%</span>
            </p>
          </div>
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Variation: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">Rose Gold</span>
            </p>
            <p className="flex text-font-grey md:text-base text-sm">
              <span className="w-[53%]"> Variation Type: </span>{" "}
              <span className="md:text-lg text-base font-normal text-text">Color</span>
            </p>
          </div>
          {vendor && vendor?.vendorId && (
            <Button
              className="mt-3 w-fit bg-black text-white"
              onClick={openUtmForm}
            >
              {translate("Generate_UTM")}
            </Button>
          )}
        </div>
      </div>
      {isUTMView && <UtmLinkForm open={isUTMView} onClose={openUtmForm}/>}
    </div>
  );
}
