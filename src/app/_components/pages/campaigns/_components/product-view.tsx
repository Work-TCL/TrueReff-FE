"use client";
import TruncateWithToolTip from "@/app/_components/ui/truncatWithToolTip/TruncateWithToolTip";
import { ImageOff } from "lucide-react";
import React, { useState } from "react";

interface IProps {
  images?: string[];
  title: string;
  description: string;
  tags?: string[];
  price?: string;
  totalInventory?: string;
}

function CampaignProductView({
  images = [],
  title,
  description,
  tags = [],
  totalInventory,
  price,
}: IProps) {
  const [activeImage, setActiveImage] = useState(
    images && images?.length > 0 ? images[0] : undefined
  );
  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="px-4 2xl:px-0">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-sm lg:max-w-sm mx-auto flex justify-center items-center flex-col border-r pr-3 h-full w-full">
            {activeImage || images?.length > 0 ? (
              <img
                className="w-full hidden dark:block h-56 object-contain"
                src={activeImage || images[0]}
                alt=""
              />
            ) : (
              <div className="h-full w-[60%] flex flex-1 items-center justify-center bg-gray-light rounded-md">
                <ImageOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
            {Array.isArray(images) &&
              images?.length > 1 &&
              images?.map((s: string, i: number) => (
                <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                  <img
                    key={i}
                    src={s}
                    onClick={() => setActiveImage(s)}
                    alt="Thumbnail 1"
                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                    // onclick="changeImage(this.src)"
                  />
                </div>
              ))}
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0 col-span-3">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {title}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                {price}
              </p>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <a
                  href="#"
                  className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white"
                >
                  {totalInventory} Inventory
                </a>
              </div>
            </div>

            {/* <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <a
                href="#"
                title=""
                className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                role="button"
              >
                <svg
                  className="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  />
                </svg>
                Add to favorites
              </a>

              <a
                href="#"
                title=""
                className="text-white mt-4 sm:mt-0 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center justify-center"
                role="button"
              >
                <svg
                  className="w-5 h-5 -ms-2 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                  />
                </svg>
                Add to cart
              </a>
            </div> */}

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {description}
            </p>
            {tags && tags?.length > 0 ? (
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
            ) : (
              "-"
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignProductView;
