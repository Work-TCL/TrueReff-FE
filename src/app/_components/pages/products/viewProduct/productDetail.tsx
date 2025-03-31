"use client";

import Input from "@/app/_components/ui/form/Input";
import { translate } from "@/lib/utils/translate";
import { useFormContext } from "react-hook-form";

export function ProductInfo() {
  const { register } = useFormContext();

  return (
    <div className="flex flex-1 flex-col gap-5">
      <p className="text-text font-medium text-xl">Product Image</p>
      <form className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col w-full gap-1">
            <label className="text-[16px] text-font-grey">
              {translate("Product Name")}
            </label>
            <input
              className="p-2 border rounded-md w-full"
              {...register("productName")}
              readOnly
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-[16px] text-font-grey">
              {translate("Product Category")}
            </label>
            <input
              className="p-2 border rounded-md w-full"
              {...register("category")}
              readOnly
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-[16px] text-font-grey">
              {translate("Product Tags")}
            </label>
            <input
              className="p-2 border rounded-md w-full"
              {...register("tags")}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label className="text-[16px] text-font-grey">
            {translate("Description")}
          </label>
          <textarea
            rows={4}
            className="p-2 border rounded-md w-full"
            value="Lorem ipsum dolor sit amet..."
            readOnly
          />
        </div>

        <div className="flex h-[45%] w-full items-start gap-3">
          <div className="flex flex-1 flex-col gap-3">
            <p className="flex text-font-grey text-base">
              <span className="w-[53%]">Base Price:</span>{" "}
              <span className="text-lg font-normal text-text">${400}</span>
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
          <div className="h-[100%] w-px bg-stroke mx-2"></div>{" "}
          <div className="flex flex-1 flex-col gap-3">
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
      </form>
    </div>
  );
}
