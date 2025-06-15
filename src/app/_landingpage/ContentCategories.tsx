"use client";

import React from "react";
import Enagel from "../../../public/assets/svg/Enagle";
import CupPlus from "../../../public/assets/svg/CupPlus";
import Lotus from "../../../public/assets/svg/Lotus";
import PantCategory from "../../../public/assets/svg/PantCategory";
import Sofa from "../../../public/assets/svg/Sofa";
import GirlStart from "../../../public/assets/svg/GirlsStart";
import BookCategory from "../../../public/assets/svg/BookCategory";
import Bag from "../../../public/assets/svg/Bag";
import ImageCategory from "../../../public/assets/svg/ImageCategory";
import Music from "../../../public/assets/svg/Music";
import { MoveRight } from "lucide-react";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";

export default function ContentCategories() {
  const router = useRouter();
  const categories = [
    { cateGoriesIcon: <Enagel /> },
    { cateGoriesIcon: <CupPlus /> },
    { cateGoriesIcon: <Lotus /> },
    { cateGoriesIcon: <Music /> },
    { cateGoriesIcon: <ImageCategory /> },
    { cateGoriesIcon: <Bag /> },
    { cateGoriesIcon: <BookCategory /> },
    { cateGoriesIcon: <GirlStart /> },
    { cateGoriesIcon: <Sofa /> },
    { cateGoriesIcon: <PantCategory /> },
  ];
  return (
    <>
      <div className="bg-[#f3ad1e] py-[85px] ">
        <div className="grid md:grid-cols-1  sm:place-items-center lg:place-item-start xl:grid-cols-2  gap-[85px] items-center max-w-[1322px] mx-auto">
          <div
            data-aos="zoom-in-right"
            className="flex flex-col justify-center items-center gap-[10px]"
          >
            <div className="flex gap-[10px]">
              {categories.slice(0, 3).map((category, index) => (
                <div
                  key={index}
                  className="xsmobile:h-[90px] xsmobile:w-[90px] tablet:h-[100px] tablet:w-[100px] h-[150px] w-[150px] xl:h-[120px] xl:w-[120px] 2xl:h-[150px] 2xl:w-[150px] flex items-center justify-center bg-[#FBBF12] rounded-[10px]"
                >
                  {category.cateGoriesIcon}
                </div>
              ))}
            </div>

            <div className="flex gap-[10px]">
              {categories.slice(3, 7).map((category, index) => (
                <div
                  key={index + 3}
                  className="xsmobile:h-[90px] xsmobile:w-[90px] tablet:h-[100px] tablet:w-[100px] h-[120px] w-[120px] xl:h-[120px] xl:w-[120px] 2xl:h-[150px] 2xl:w-[150px] flex items-center justify-center bg-[#FBBF12] rounded-[10px]"
                >
                  {category.cateGoriesIcon}
                </div>
              ))}
            </div>

            <div className="flex gap-[10px]">
              {categories.slice(7, 10).map((category, index) => (
                <div
                  key={index + 7}
                  className="xsmobile:h-[90px] xsmobile:w-[90px] tablet:h-[100px] tablet:w-[100px] h-[120px] w-[120px] xl:h-[120px] xl:w-[120px] 2xl:h-[150px] 2xl:w-[150px] flex items-center justify-center bg-[#FBBF12] rounded-[10px]"
                >
                  {category.cateGoriesIcon}
                </div>
              ))}
            </div>
          </div>

          <div data-aos="zoom-in-left" className="mobile:px-12">
            <h2 className="text-[46px] tablet:text-[40px] tablet:leading-[59px] xsmobile:text-[30px] xsmobile:leading-[59px] font-medium text-[#333333] max-w-[594px] mb-[40px] leading-[59px]">
              Whatever You Create, We Have a Brand for <b>You.</b>
            </h2>
            <p className="text-xl font-medium text-[#333333] max-w-[632px] mb-10 ">
              whether you’re just starting out or already a trendsetter. No
              matter what type of content you create, Truereff has brands in
              every category ready to partner with you. From fashion and beauty
              to tech and lifestyle, your niche is covered. Join us and start
              earning with brands that match your passion.
            </p>

            <ButtonLogin
              label="Get Started"
              onClick={() => {
                router.push("/login");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
