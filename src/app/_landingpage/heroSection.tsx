"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@sohanemon/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";
import { SwitchingText } from "./TruereffHeroSlider";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="w-[100vw] overflow-hidden items-center bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff]">
      {/* Section One */}
      <section className="max-w-7xl xsmobile:items-center mx-auto py-20  md:py-[150px] flex flex-col-reverse lg:flex-row items-start tablet:items-center sm:items-center justify-between gap-[48px]">
        <div className=" text-center lg:text-left">
          <h1
            data-aos="fade-left"
            className="capitalize text-[70px] leading-[90px] xsmobile:text-[40px] xsmobile:leading-[60px]  font-bold text-[#333333]"
          >
            Your
            <span className="text-primary capitalize ml-2">
              <SwitchingText texts={["content", "audience", "earnings"]} onComplete={()=>{}} />
            </span>
          </h1>
          <div className=" xsmobile:flex xsmobile:items-center xsmobile:flex-col tablet:flex tablet:items-center tablet:flex-col md:flex md:flex-col md:items-center lg:flex lg:items-start	">
            <p
              data-aos="fade-right"
              className="text-[#333333] mt-[40px] mb-[50px] max-w-[454px] font-medium eading-[28px]	text-[20px]"
            >
              Truereff makes it easy for creators to connect with trusted brands
              and earn fair commissions — zero upfront cost, zero stress.
            </p>
            <ButtonLogin
              label="Get Started"
              dataAos="flip-up"
              onClick={() => {
                router.push("/login");
              }}
            />
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center items-center gap-4">
          {/* Placeholder image group - customize with actual images */}
          <div className="flex  sm:gap-4 gap-2">
            <div
              data-aos="flip-up"
              className="relative xsmobile:w-[95px] w-[164px] h-[400px] rounded-[400px] shadow-xl"
            >
              <Image
                src={"/assets/landing/girl-holding-cell.png"}
                alt={`Creator-1`}
                fill
                className="object-cover"
              />
              <div className="flex items-center justify-center absolute top-[40px] xsmobile:right-[120px] right-[135px] bg-white p-1 rounded-lg shadow xsmobile:h-[30px] xsmobile:w-[30px] h-[50px] w-[50px]">
                <img src="/assets/landing/smile.png" className="w-4 h-4" />
              </div>
            </div>
            <div
              data-aos="flip-down"
              className="relative xsmobile:w-[95px] w-[164px] h-[400px] rounded-[400px] shadow-xl mt-[100px]"
            >
              <Image
                src={
                  "/assets/landing/young-beautiful-woman-wearing-red-leather-jacket.png"
                }
                alt={`Creator-2`}
                fill
                className="object-cover"
              />
              <div className="flex items-center justify-center absolute top-[150px] xsmobile:right-[125px]  right-[145px] bg-white p-1 rounded-lg shadow xsmobile:h-[30px] xsmobile:w-[30px] h-[50px] w-[50px]">
                <img src="/assets/landing/heart.png" className="w-4 h-4" />
              </div>
            </div>
            <div
              data-aos="flip-up"
              className="relative  xsmobile:w-[95px] w-[130px] h-[400px] rounded-[400px] shadow-xl"
            >
              <Image
                src={
                  "/assets/landing/pretty-teen-girl-wearing-hat-taking-selfies.png"
                }
                alt={`Creator-3`}
                fill
                className="object-cover"
              />
              <div className="absolute xsmobile:top-[24rem] top-[22.70rem] right-12 bg-white p-1 rounded-lg shadow xsmobile:h-[30px] xsmobile:w-[30px] h-[50px] w-[50px] flex items-center justify-center">
                <img src="/assets/landing/tickMark.png" className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Two */}
      <section className="bg-white flex flex-col  ">
        <div
          data-aos="fade-down"
          className="flex flex-col text-center xsmobile:gap-[10px] gap-[40px] items-center justify-center"
        >
          <p className="xl:text-[70px] font-medium xl:leading-[90px] md:text-5xl md:leading-[1.3] text-3xl text-center font-medium text-gray-900 capitalize">
            Powering
            <span className="text-primary font-bold	"> Creators</span>, trusted
            by Brands
          </p>
          <p className="text-gray-700 sm:text-[20px] ">
            Turn every post into profit💰, connect with brands that value your
            influence.
          </p>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-[57px]">
          <div
            data-aos="zoom-in"
            className="relative tablet:w-[400px] xsmobile:w-[300px] w-[670px] mt-[76px] flex flex-col items-center"
          >
            <Image
              src="/assets/landing/creator-1.png"
              alt="Aditi Shah"
              width={597}
              height={680}
            />
            <div className="absolute top-[110px] xsmobile:left-[-20px] xsmobile:top-[60px] tablet:left-[-50px] tablet:top-[90px] left-0 flex flex-col  justify-center">
              <p className="text-[40px] leading-[46px] xsmobile:text-[16px] xsmobile:leading-[18px] tablet:text-[20px] tablet:leading-[26px]  font-medium">
                Aditi Shah
              </p>
              <p className="text-[20px] leading-[20px] target:text-[15px] xsmobile:text-[12px] font-medium text-gray-500">
                @aditishahme
              </p>
            </div>
            <div className="absolute top-[230px] xsmobile:top-[110px] xsmobile:left-[50px] tablet:top-[160px] tablet:left-[80px] left-[150px] bg-white p-1 rounded-lg shadow h-[60px] w-[60px] xsmobile:w-[30px] xsmobile:h-[30px] tablet:w-[30px] tablet:h-[30px] flex items-center justify-center">
              <Image
                height={30}
                width={30}
                src="/assets/landing/Instagram.png"
                alt="instagaram"
              />
            </div>
            <div className="flex items-center justify-center absolute top-[490px] xsmobile:top-[250px] xsmobile:right-[20px] tablet:top-[330px] tablet:right-[30px] right-[50px] bg-white p-1 rounded-lg shadow xsmobile:w-[30px] xsmobile:h-[30px] h-[60px] w-[60px] tablet:w-[30px] tablet:h-[30px]">
              <Image
                height={30}
                width={30}
                alt="heart"
                src="/assets/landing/faceBookLandingpage.png"
              />
            </div>
            <div className="flex items-center justify-center absolute top-[100px] xsmobile:top-[40px] xsmobile:right-[50px] tablet:top-[70px] tablet:right-[75px] right-[120px] bg-white p-1 rounded-lg shadow  xsmobile:w-[30px] xsmobile:h-[30px] h-[60px] w-[60px] tablet:w-[30px] tablet:h-[30px]">
              <Image
                height={30}
                width={30}
                alt="smile"
                src="/assets/landing/Bag.png"
              />
            </div>
          </div>

          <div
            data-aos="zoom-in"
            className="grid grid-cols-3 border mt-[51px] mb-[51px] rounded-[9px] border-[#33333333]"
          >
            {[
              "/assets/landing/brand-1.png",
              "/assets/landing/brand-2.png",
              "/assets/landing/brand-3.png",
              "/assets/landing/brand-4.png",
              "/assets/landing/brand-5.png",
              "/assets/landing/brand-6.png",
              "/assets/landing/brand-7.png",
              "/assets/landing/brand-8.png",
              "/assets/landing/brand-9.png",
            ].map((src, i) => (
              <div
                key={i}
                className={cn("rounded-xl flex items-center justify-center")}
              >
                <Image
                  src={src}
                  alt={`Brand ${i + 1}`}
                  width={190}
                  height={190}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
