"use client";

import React from "react";
import ShareImage from "../../../public/assets/svg/ShareImage";
import LocationImage from "../../../public/assets/svg/Location";
import PhoneImage from "../../../public/assets/svg/PhoneImage";
import YouTubeImage from "../../../public/assets/svg/Youtube";
import LinkedinImage from "../../../public/assets/svg/LinkedinImage";
import TwitterImage from "../../../public/assets/svg/TwitterImage";
import FaceBookImage from "../../../public/assets/svg/FaceBookImage";
import Image from "next/image";
import Link from "next/link";

export default function LandingPageFooter({
  className = "",
  isLanginPage = true,
}) {
  return (
    <footer
      className={`w-full overflow-hidden bg-[#333333] dark:bg-gray-900 ${className} ${
        isLanginPage
          ? "xsmobile:pt-[100px] tablet:pt-[120px] sm:pt-[160px] lg:pt-[325px] mt-[-596px]"
          : ""
      } px-5`}
    >
      <div className="mx-auto w-full max-w-[1720px] ">
        <div className="flex  mobile:flex-col tablet:pt-0  sm:flex-col md:flex-row md:gap-[20px] sm:pt-10 xl:gap-[20px]">
          <a
            href="/"
            data-aos="fade-down-right"
            className="tablet:flex tablet:justify-center "
          >
            <Image
              src="/assets/common/truereff-white.svg"
              height={50}
              width={352}
              alt="TrueReff Logo"
            />
          </a>

          <div
            data-aos="fade-left"
            className="tablet:max-w-full w-full flex justify-between xsmobile:flex-col xsmobile:pl-[20px] tablet:flex-col md:flex-col lg:flex-row flex-row xsmobile:w-full max-w-[1100px] gap-[40px] ml-auto"
          >
            <div className="flex flex-col md:w-[448px] xsmobile:pt-10 tablet:flex-col tablet:w-full tablet:justify-center tablet:items-center tablet:pt-6">
              <h2 className="mb-[30px] text-[24px] leading-[16px] font-light text-gray-500 ">
                Quick Links
              </h2>
              <div className="flex xsmobile:gap-0 xsmobile:flex-col tablet:flex-row tablet:gap-[40px] md:gap-[40px] lg:gap-[40px] xl:justify-between ">
                <ul className="text-white text-[20px] leading-[16px] font-medium	">
                  <li className="mb-[30px]">
                    <a href="" className="hover:underline">
                      For Creators
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="" className="hover:underline">
                      For Brands
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="/aboutus" className="hover:underline">
                      About Us
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="" className="hover:underline">
                      Blogs
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="" className="hover:underline">
                      Case Studies
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="/contact" className="hover:underline">
                      Contact Us
                    </a>
                  </li>
                </ul>
                <ul className="text-white text-[20px] leading-[16px] font-medium">
                  <li className="mb-[30px]">
                    <a href="" className="hover:underline ">
                      Careers
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="/privacy-policy" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="" className="hover:underline">
                      Cookie Policy
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="/terms-condition" className="hover:underline">
                      Terms Of Service
                    </a>
                  </li>
                  <li className="mb-[30px]">
                    <a href="/transaction-policy" className="hover:underline">
                      Transaction Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="xsmobile:flex-col xsmobile:max-w-full w-full tablet:max-w-full tablet:flex tablet:flex-col tablet:justify-center tablet:items-center tablet:pt-6 md:max-w-full lg:max-w-[343px] max-w-[398px] tablet:mx-auto">
              <h2 className="mb-[30px] text-[24px] leading-[16px] font-light text-gray-500">
                Support
              </h2>
              <ul className="text-white text-[20px] leading-[28px] font-medium">
                <li className="mb-[30px]">
                  <a href="#" className="hover:underline flex">
                    <span className="pt-1 pr-3">
                      <LocationImage />
                    </span>{" "}
                    Shop no 2 ozon shopping centre kamrej bardoli road surat
                    Gujarat PIN code : 394180
                  </a>
                </li>
                <li className="mb-[30px]">
                  <a href="#" className="hover:underline  flex">
                    <span className="pt-1 pr-3">
                      <ShareImage />
                    </span>{" "}
                    Support@truereff.com
                  </a>
                </li>
                <li className="mb-[30px]">
                  <a href="#" className="hover:underline flex">
                    <span className="pt-1 pr-3">
                      <PhoneImage />
                    </span>{" "}
                    +91 79908 17357
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sm:flex sm:items-center sm:justify-between sm:pb-20 pb-10 pt-10 md:pt-24 xsmobile:pl-[20px] px-[30px] ">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Copyright © 2024
            <a href="" className="hover:underline">
              Truereff
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex gap-3 items-baseline mt-4 sm:justify-center sm:mt-0">
            <Link href="https://www.youtube.com/@truereff" target="_blank">
              <YouTubeImage />
            </Link>
            <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
            >
              <LinkedinImage />
            </Link>

            <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
            >
              <TwitterImage />
            </Link>

            <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
            >
              <FaceBookImage />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
