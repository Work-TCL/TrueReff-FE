"use client";

import React from "react";
import ShareImage from "../../../public/assets/svg/ShareImage";
import LocationImage from "../../../public/assets/svg/Location";
import PhoneImage from "../../../public/assets/svg/PhoneImage";
import Image from "next/image";
import Link from "next/link";
import { AiFillInstagram, AiFillYoutube } from "react-icons/ai";

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
        <div className="flex  mobile:flex-col tablet:pt-0  sm:flex-col lg:flex-row md:gap-[20px] sm:pt-20 xl:gap-[40px]">
          <Link
            href="/"
            data-aos="fade-down-right"
            className="tablet:flex h-fit w-fit lg:pt-0 pt-10"
          >
            <Image
              src="/assets/common/truereff-white.svg"
              height={50}
              width={352}
              alt="TrueReff Logo"
              className="2xl:max-w-[352px] sm:max-w-[317px] max-w-[260px]"
            />
          </Link>

          <div
            data-aos="fade-left"
            className="tablet:max-w-full w-full flex justify-between xsmobile:flex-col xsmobile:pl-[20px] tablet:flex-col sm:flex-col md:flex-row flex-row xsmobile:w-full 2xl:max-w-[1100px] max-w-[950px] gap-[40px] ml-auto"
          >
            <div className="text-nowrap flex flex-col md:w-[448px] xsmobile:pt-10 tablet:flex-col tablet:w-full tablet:pt-6">
              <h2 className="mb-[30px] text-[24px] leading-[16px] font-light text-gray-500 ">
                Quick Links
              </h2>
              <div className="flex xsmobile:gap-0 xsmobile:flex-col tablet:flex-row tablet:gap-[40px] md:gap-[30px] lg:gap-[30px] 2xl:gap-[40px] xl:justify-between ">
                <ul className="text-white text-[20px] leading-[16px] font-medium	">
                  <li className="mb-[30px]">
                    <Link href="/" className="hover:underline text-nowrap">
                      For Creators
                    </Link>
                  </li>
                  <li className="mb-[30px]">
                    <Link href="/vendor" className="hover:underline">
                      For Brands
                    </Link>
                  </li>
                  <li className="mb-[30px]">
                    <Link href="/aboutus" className="hover:underline">
                      About Us
                    </Link>
                  </li>
                  {/* <li className="mb-[30px]">
                    <Link href="" className="hover:underline">
                      Blogs
                    </Link>
                  </li> */}
                  {/* <li className="mb-[30px]">
                    <Link href="" className="hover:underline">
                      Case Studies
                    </Link>
                  </li> */}
                  <li className="mb-[30px]">
                    <Link href="/contact" className="hover:underline">
                      Contact Us
                    </Link>
                  </li>
                </ul>
                <ul className="text-white text-[20px] leading-[16px] font-medium">
                  {/* <li className="mb-[30px]">
                    <Link href="" className="hover:underline ">
                      Careers
                    </Link>
                  </li> */}
                  <li className="mb-[30px]">
                    <Link href="/privacy-policy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  {/* <li className="mb-[30px]">
                    <Link href="" className="hover:underline">
                      Cookie Policy
                    </Link>
                  </li> */}
                  <li className="mb-[30px]">
                    <Link href="/terms-condition" className="hover:underline">
                      Terms Of Service
                    </Link>
                  </li>
                  <li className="mb-[30px]">
                    <Link
                      href="/transaction-policy"
                      className="hover:underline"
                    >
                      Transaction Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="xsmobile:flex-col xsmobile:max-w-full w-full tablet:max-w-[398px] tablet:flex tablet:flex-col  tablet:pt-6 md:max-w-full lg:max-w-[343px] max-w-[398px]">
              <h2 className="mb-[30px] text-[24px] leading-[16px] font-light text-gray-500">
                Support
              </h2>
              <ul className="text-white text-[20px] leading-[28px] font-medium">
                <li className="mb-[30px]">
                  <div className="flex">
                    <span className="pt-1 pr-3">
                      <LocationImage />
                    </span>{" "}
                    Shop no 2 ozon shopping centre kamrej bardoli road surat
                    Gujarat PIN code : 394180
                  </div>
                </li>
                <li className="mb-[30px]">
                  <div className="flex">
                    <span className="pt-1 pr-3">
                      <ShareImage />
                    </span>{" "}
                    Support@truereff.com
                  </div>
                </li>
                <li className="mb-[30px]">
                  <div className="flex">
                    <span className="pt-1 pr-3">
                      <PhoneImage />
                    </span>{" "}
                    +91 79908 17357
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sm:flex sm:items-center sm:justify-between sm:pb-20 pb-10 pt-10 md:pt-24 xsmobile:pl-[20px] px-[30px] ">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            Copyright © 2024 Truereff. All Rights Reserved.
            {/* <Link href="" className="hover:underline"> */}
            {/* </Link> */}
          </span>
          <div className="flex gap-3 items-baseline mt-4 sm:justify-center sm:mt-0">
            <Link
              href="https://www.youtube.com/@truereff"
              target="_blank"
              className="text-[#FF4979] text-xl"
            >
              <AiFillYoutube />
            </Link>
            <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
              className="text-[#FF4979] text-xl"
            >
              <AiFillInstagram />
            </Link>
            {/* <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
            >
              <LinkedinImage />
            </Link> */}

            {/* <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
            >
              <TwitterImage />
            </Link> */}

            {/* <Link
              href="https://www.instagram.com/truereffofficial/"
              target="_blank"
            >
              <FaceBookImage />
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
