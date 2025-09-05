"use client";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { ImageOff, IndianRupee } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface IProps {
  images?: string[];
  title: string;
  description: string;
  tags?: string[];
  price?: string;
  totalInventory?: string;
  variants?: any[];
}

function CampaignProductView({
  images = [],
  title,
  description,
  tags = [],
  totalInventory,
  price,
  variants = [],
}: IProps) {
  const translate = useTranslations();
  const [activeImage, setActiveImage] = useState(
    images && images?.length > 0 ? images[0] : undefined
  );

  return (
    <section className="py-5 bg-white md:py-5 dark:bg-gray-900 antialiased">
      <div className="">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-16">
          <div className="shrink-0 mx-auto flex justify-center items-center flex-col lg:border-r pr-3 w-full">
            {activeImage || images?.length > 0 ? (
              <img
                className="w-full dark:block h-56 object-contain product-img"
                src={activeImage || images[0]}
                alt=""
              />
            ) : (
              <div className="h-full w-[60%] flex flex-1 items-center justify-center bg-gray-light rounded-md">
                <ImageOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {Array.isArray(images) && images?.length > 1 && (
              <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                {Array.isArray(images) &&
                  images?.length > 1 &&
                  [...images]?.map((s: string, i: number) => (
                    <img
                      key={i}
                      src={s}
                      onClick={() => setActiveImage(s)}
                      alt="Thumbnail 1"
                      className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300 product-img"
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0 col-span-3">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {title}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {price ? (
                  <span className="flex items-center">
                    <IndianRupee />
                    {price}
                  </span>
                ) : (
                  "-"
                )}
              </p>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <a
                  href="#"
                  className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                >
                  {totalInventory ? `${totalInventory} Inventory` : ""}
                </a>
              </div>
            </div>

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            {description && (
              <p
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
                className="mb-6 text-gray-500 dark:text-gray-400"
              />
            )}
            {tags && tags?.length > 0 && (
              <div className="flex gap-2 mt-1">
                {tags.map((tag: string, index: number) => (
                  <TruncateWithToolTip
                    key={index}
                    checkHorizontalOverflow={true}
                    className="md:text-xs text-[10px] md:px-3 text-center px-1 py-1 bg-gray-100 text-gray-800 rounded-full border border-gray-300 w-fit line-clamp-none truncate"
                    text={`#${tag}`}
                  />
                ))}
              </div>
            )}
            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h3 className="text-md font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {translate("variants")}
              </h3>
              {variants &&
                variants?.length > 0 &&
                variants.map((variant: any, index: number) => (
                  <div
                    key={index}
                    className="flex  md:flex-row items-start gap-2"
                  >
                    <div className="w-auto text-sm text-gray-500">
                      {variant?.title}:
                    </div>
                    <div className="font-medium text-sm ">
                      {variant?.price ? (
                        <span className="flex items-center">
                          <IndianRupee size={10} />
                          {variant?.price}
                        </span>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignProductView;
