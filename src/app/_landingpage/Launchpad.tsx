"use client";

import { MoveRight } from "lucide-react";
import React from "react";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";

export default function Launchpad() {
  const router = useRouter();
  return (
    <>
      <div className="w-[100vw] overflow-hidden bg-[url('/assets/landing/launchpad.png')] bg-cover bg-center bg-no-repeat tablet:pb-[220px] xsmobile:px-[20px] xsmobile:pb-[200px]  xsmobile:pt-[140px] tablet:px-[20px] tablet:pt-[140px] sm:pb-[250px] sm:pt-[140px] lg:pb-[301px] lg:pt-[240px] w-full sm:px-[20px] xl:px-0">
        <div className="max-w-[1920px] mx-auto flex mobile:flex-col sm:flex-col lg:flex-row xsmobile:gap-[50px] tablet:gap-[50px] sm:gap-[50px] lg:gap-[100px] justify-center items-center">
          <div
            data-aos="fade-down"
            className="md:text-[60px] sm:text-4xl text-3xl font-medium text-gray-900 max-w-[565px] md:leading-[70px]"
          >
            Turn your recommendations into
            <span className="text-primary font-bold"> revenue.</span>
          </div>
          <div
            data-aos="fade-left"
            className="max-w-[575px] sm:text-[20px] text-right leading-[28px]"
          >
            <p>
              Help your followers discover the best products and earn every time
              they shop through your content. With Truereff, grow your
              influence, reach more people, and handle it all easily in one
              simple app.
            </p>
          </div>
        </div>
      </div>

      <div
        data-aos="zoom-in"
        className="flex justify-center items-center relative  bottom-[150px] h-[300px] mb-[300px]"
      >
        <div className="relative xsmobile:py-[20px] tablet:py-[30px] md:py-[60px] tablet:w-[480px] xsmobile:w-[300px]  sm:w-[450px] md:w-[700px] lg:py-[125px] lg:w-[1000px] xl:w-full flex justify-between items-center bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff] max-w-[1200px] mobile:rounded-[10px] sm:rounded-[10px] md:rounded-[15px] w-full mobile:px-[20px] sm:px-[20px] md:px-[30px] lg:px-[60px]">
          <p className="xsmobile:text-xs	 sm:text-sm md:text-2xl lg:text-4xl xl:text-5xl font-medium text-gray-900">
            Try <span className="text-primary font-bold "> Truereff</span> for
            free
          </p>
          <img
            src="/assets/landing/iphoneTwo.png"
            className="absolute tablet:top-[-60px]  md:top-[-80px] lg:top-[-140px] xsmobile:top-[-28px] xsmobile:right-[80px]  tablet:right-[140px] md:right-[200px] xsmobile:w-[100px] tablet:w-[180px] sm:w-[160px] md:w-[280px]  lg:h-[620px] lg:w-[460px] xl:w-[550px]"
          />
          <ButtonLogin
            label="Get Started"
            spanClassName=" tablet:text-[14px] mobile:text-[8px]"
            className=" tablet:w-[130px]  xsmobile:w-[75px] w-[210px] h-[50px] xsmobile:pl-[4px] tablet:h-[40px] tablet:pl-[10px] xsmobile:h-[25px]"
            iconClassName=" h-[44px] w-[44px] tablet:h-[30px] tablet:w-[30px] xsmobile:h-[15px] xsmobile:w-[15px]"
            onClick={() => router.push("/login")}
          />
        </div>
      </div>
    </>
  );
}
