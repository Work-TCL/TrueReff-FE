"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@sohanemon/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function HeroSection() {

   useEffect(() => {
    AOS.init({
        once: false,   // animation baar baar ho scroll karne par
  mirror: true,
      duration: 1000, 
    });
    AOS.refresh();
    }, []);

  return (
    <div className="w-full bg-gradient-to-br from-[#ffe2ec] to-[#e1f1ff]">
      {/* Section One */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] leading-tight">
            <span className="text-primary">Empowering</span>
            <br />
            creator to grow, collaborate & earn
          </h1>
          <p className="text-[#333333] text-lg">
            Boost your social media engagement, collaborate with top brands and
            monetize 100% of your content with Wishlink
          </p>
          <button className="group relative flex items-center justify-between pl-6 pr-[1px] py-[1px] rounded-full bg-primary text-white text-base overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-pink-600 hover:bg-white max-w-[215px] w-full">
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-right transition-transform duration-300 ease-in-out group-hover:scale-x-100 z-0" />
            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-primary">
              Get Started
            </span>
            <div className="relative z-10 flex items-center justify-center h-[44px] w-[44px] rounded-full bg-white transition-colors duration-300 ease-in-out">
              <MoveRight className="text-primary transition-colors duration-300 ease-in-out" />
            </div>
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center items-center gap-4">
          {/* Placeholder image group - customize with actual images */}
          <div className="flex gap-4">
            <div className="relative w-[164px] h-[400px] rounded-[400px] shadow-xl">
              <Image
                src={"/assets/landing/girl-holding-cell.png"}
                alt={`Creator-1`}
                fill
                className="object-cover"
              />
              <div className="flex items-center justify-center absolute top-[40px] right-[135px] bg-white p-1 rounded-lg shadow h-[50px] w-[50px]">
                <img src="/assets/landing/smile.png" className="w-4 h-4" />
              </div>
            </div>
            <div className="relative w-[164px] h-[400px] rounded-[400px] shadow-xl mt-[100px]">
              <Image
                src={
                  "/assets/landing/young-beautiful-woman-wearing-red-leather-jacket.png"
                }
                alt={`Creator-2`}
                fill
                className="object-cover"
              />
              <div className="flex items-center justify-center absolute top-[150px] right-[145px] bg-white p-1 rounded-lg shadow h-[50px] w-[50px]">
                <img src="/assets/landing/heart.png" className="w-4 h-4" />
              </div>
            </div>
            <div className="relative w-[164px] h-[400px] rounded-[400px] shadow-xl">
              <Image
                src={
                  "/assets/landing/pretty-teen-girl-wearing-hat-taking-selfies.png"
                }
                alt={`Creator-3`}
                fill
                className="object-cover"
              />
              <div className="absolute top-[22.70rem] right-12 bg-white p-1 rounded-lg shadow h-[50px] w-[50px] flex items-center justify-center">
                <img src="/assets/landing/tickMark.png" className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Two */}
      <section className="bg-white py-16 flex flex-col gap-[50px] ">
        <div className="flex flex-col gap-[35px] items-center justify-center">
          <p className="text-4xl md:text-7xl font-medium text-gray-900 leading-tight">
            Loved by
            <span className="text-primary"> Creators</span>, trusted by Brands
          </p>
          <p className="text-gray-700 text-xl">
             Join forces with fellow Creators, partner with leading Brands like
            never before
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="relative flex flex-col items-center lg:items-start text-center lg:text-left">
            <Image
              src="/assets/landing/creator-1.png"
              alt="Aditi Shah"
              width={597}
              height={680}
            />
            <div className="absolute top-[128px] right-[400px] flex flex-col items-center justify-center">
              {" "}
              <h2 className="text-2xl font-semibold">Aditi Shah</h2>
              <p className="text-sm text-gray-500">@aditishahme</p>
            </div>
            <div className="absolute top-[240px] right-[400px] bg-white p-1 rounded-lg shadow h-[50px] w-[50px] flex items-center justify-center">
              <img src="/assets/landing/tickMark.png" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-center absolute top-[490px] right-[50px] bg-white p-1 rounded-lg shadow h-[50px] w-[50px]">
              <img src="/assets/landing/heart.png" className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-center absolute top-[100px] right-[100px] bg-white p-1 rounded-lg shadow h-[50px] w-[50px]">
              <img src="/assets/landing/smile.png" className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:gap-0">
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
