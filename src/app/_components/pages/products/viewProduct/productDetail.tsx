"use client";
import { translate } from "@/lib/utils/translate";
import { IProduct } from "./viewDetailProduct";

interface IProductInfoProps {
  productData: IProduct
}
export function ProductInfo({productData}:IProductInfoProps) {

  return (
    <div className="flex flex-1 flex-col gap-5">
      <p className="text-text font-medium text-xl">General Information</p>
          <div className="flex flex-col w-full gap-1">
            <label className="text-[16px] text-font-grey">
              {translate("Product_Name")}
            </label>
            <div
              className="p-2  bg-[#FAFAFA] rounded-md w-full"
            >{productData?.name}</div>
          </div>
        <div className="flex flex-col w-full gap-1">
            <label className="text-[16px] text-font-grey">
              {translate("Product_Category")}
            </label>
            <div
              className="p-2  bg-[#FAFAFA] rounded-md w-full"
            >{productData?.category}</div>
          </div>
          
        <div className="flex flex-col w-full gap-1">
            <label className="text-[16px] text-font-grey">
              {translate("Product_Tags")}
            </label>
            <div
              className="flex flex-wrap w-full gap-3"
            >
              {productData?.tags?.map((tag:string,index:number) => {
                return (
                  <div key={`${tag}_${index}`} className="py-1 px-2 border rounded-md bg-gray-100 border-gray-10">#{tag}</div>
                )
              })}
            </div>
          </div>
        <div className="flex flex-col w-full gap-1">
          <label className="text-[16px] text-font-grey">
            {translate("Description")}
          </label>
          <div
            className={`p-2 bg-[#FAFAFA] rounded-md w-full ${productData?.description ? "":"h-[100px]"}`}
          >{productData?.description}</div>
        </div>

        <div className="flex h-[45%] md:flex-row flex-col w-full items-start gap-3">
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]">Base Price:</span>{" "}
              <span className="text-lg font-normal text-text">${productData?.price}</span>
            </p>

            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="text-lg font-normal text-text">No discount</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Discount Type: </span>{" "}
              <span className="text-lg font-normal text-text">0</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Tax Class: </span>{" "}
              <span className="text-lg font-normal text-text">Tax Free</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> VAT Amount: </span>{" "}
              <span className="text-lg font-normal text-text">12%</span>
            </p>
          </div>
          <div className="h-[100%] w-px bg-stroke mx-2 md:block hidden"></div>{" "}
          <div className="flex w-full flex-1 flex-col gap-3">
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Variation: </span>{" "}
              <span className="text-lg font-normal text-text">Rose Gold</span>
            </p>
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]"> Variation Type: </span>{" "}
              <span className="text-lg font-normal text-text">Color</span>
            </p>
          </div>
        </div>
    </div>
  );
}
