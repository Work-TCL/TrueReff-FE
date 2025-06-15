"use client";

import { cn } from "@sohanemon/utils";
import Image from "next/image";
import React from "react";

export default function EarningsSection() {
  const features = [
    {
      text: "Create Your Creator Store",
      icon: "/assets/landing/earningStep-1.png",
    },
    {
      text: "Collaborate with Brands on Commission Basis",
      icon: "/assets/landing/earningStep-2.png",
    },
    {
      text: "Connect Your Social Media",
      icon: "/assets/landing/earningStep-3.png",
    },
    {
      text: "Create Engaging Content",
      icon: "/assets/landing/earningStep-4.png",
    },
    {
      text: "Post & Drive Sales",
      icon: "/assets/landing/earningStep-5.png",
    },
    {
      text: "Get Paid for Every Sale",
      icon: "/assets/landing/earningStep-6.png",
    },
  ];

  return (
    <section className="flex flex-col gap-[70px] w-full bg-primary text-white py-[100px] ">
      <div data-aos="zoom-in-up" className="flex items-center justify-center ">
        <p className="text-[70px] font-medium leading-[90px] xsmobile:text-[40px] xsmobile:leading-[60px]  text-center">
          Turn your influence <br />
          into steady
          <span className="font-bold"> income</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12  ">
        {/* Left Illustration */}
        <div
          data-aos="zoom-in-down"
          className=" flex flex-col gap-[69px] max-w-[520px] w-full items-center justify-center"
        >
          <div className="w-full max-w-[520px]  flex justify-center">
            <Image
              src="/assets/landing/earning-patner.png"
              alt="Networking"
              width={520}
              height={410}
              className="max-w-full h-auto"
            />
          </div>
          {/* <div className=" text-white text-[20px] leading-[28px] text-center">
            Partner with leading Brands to earn commissions and unlock paid
            collaboration opportunities
          </div> */}
        </div>

        {/* Right Content */}
        <div
          data-aos="zoom-in-left"
          className="w-fullspace-y-6 xsmobile:justify-center relative"
        >
          <div className="absolute top-0 bottom-0 left-[35px] xsmobile:left-[20px] w-0.5 bg-gray-300 dark:bg-gray-700"></div>

          <ul className="flex flex-col gap-[30px]">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-4 relative">
                <div
                  className={cn(
                    "rounded-full p-2 w-[70px] h-[70px] xsmobile:w-[40px] xsmobile:h-[40px]  flex items-center justify-center ",
                    index === 1 ? "bg-primary border border-white" : "bg-white "
                  )}
                >
                  <Image src={feature.icon} alt="icon" width={30} height={30} />
                </div>
                <p className="text-[20px] xsmobile:text-[14px] tablet:text-[18px] font-bold	">
                  {feature.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
