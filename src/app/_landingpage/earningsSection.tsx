"use client";

import { cn } from "@sohanemon/utils";
import Image from "next/image";
import React from "react";

export default function EarningsSection() {
  const features = [
    {
      text: "Monetize 100% of your content",
      icon: "/assets/landing/earningStep-1.png",
    },
    {
      text: "Connect and collaborate with 250+ Brands",
      icon: "/assets/landing/earningStep-2.png",
    },
    {
      text: "Boost your social media influence",
      icon: "/assets/landing/earningStep-3.png",
    },
    {
      text: "Experience the ease of instant link sharing",
      icon: "/assets/landing/earningStep-4.png",
    },
    {
      text: "Unlock the power of automated engagement",
      icon: "/assets/landing/earningStep-5.png",
    },
    {
      text: "Source products at zero cost",
      icon: "/assets/landing/earningStep-6.png",
    },
  ];

  return (
    <section className="flex flex-col gap-[70px] w-full bg-primary text-white py-20 px-6">
      <div data-aos="zoom-in-up" className="flex items-center justify-center ">
        <h2 className="text-4xl font-medium leading-tight">
          Unlock the influence and <br />
          maximize your <span className="font-bold">earnings</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Illustration */}
        <div data-aos="zoom-in-down" className=" flex flex-col gap-[40px] items-center justify-center">
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/assets/landing/earning-patner.png"
              alt="Networking"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
          <div className=" text-white text-center w-[66%]">
            Partner with leading Brands to earn commissions and unlock paid
            collaboration opportunities
          </div>
        </div>

        {/* Right Content */}
        <div data-aos="zoom-in-left" className="w-full md:w-1/2 space-y-6">
          <ul className="flex flex-col gap-[30px]">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-4">
                <div
                  className={cn(
                    "rounded-full p-2 w-10 h-10 flex items-center justify-center",
                    index === 1 ? "bg-primary border border-white" : "bg-white"
                  )}
                >
                  <Image src={feature.icon} alt="icon" width={20} height={20} />
                </div>
                <p className="text-base">{feature.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
