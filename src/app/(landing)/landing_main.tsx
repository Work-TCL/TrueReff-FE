"use client";

import { MoveRight } from "lucide-react";
import React, { useState } from "react";
import HeroSection from "./heroSection";
import EarningsSection from "./earningsSection";

export default function LandingPage() {
  const [activeLink, setActiveLink] = useState("creator");

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
  };

  return (
    <div className="relative w-full h-screen overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-[99%] object-cover -z-10"
      >
        <source src="/assets/landing/landingVideo.mp4" type="video/mp4" />
      </video>

      {/* Navbar */}
      <nav className="flex justify-between items-start p-4 text-white h-full ">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <img
            src="/assets/landing/logo_TrueReff.svg"
            alt="Truerreff Logo"
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-6 text-lg">
            {["creator", "brand", "about"].map((link) => (
              <li
                key={link}
                className="relative cursor-pointer"
                onClick={() => handleLinkClick(link)}
              >
                <span className="relative">
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </span>
                {activeLink === link && (
                  <div className="w-full h-1 bg-primary rounded-sm" />
                )}
              </li>
            ))}
          </ul>

          <button className="group relative flex items-center justify-between pl-6 pr-[1px] py-[1px] rounded-full bg-primary text-white text-base overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-pink-600 hover:bg-white w-[215px]">
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-right transition-transform duration-300 ease-in-out group-hover:scale-x-100 z-0" />
            <span className="relative z-10 transition-colors duration-300 ease-in-out group-hover:text-primary">
              Get Started
            </span>
            <div className="relative z-10 flex items-center justify-center h-[44px] w-[44px] rounded-full bg-white transition-colors duration-300 ease-in-out">
              <MoveRight className="text-primary transition-colors duration-300 ease-in-out" />
            </div>
          </button>
        </div>
      </nav>

      {/* Marquee Section */}
      <div
        className="w-full text-white overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, #9f5de9, #38a2f5, #ff4979, #fbbf12)",
        }}
      >
        <div className="flex w-max animate-marquee whitespace-nowrap gap-20 py-3 text-sm font-medium px-4">
          {Array(10).fill(
            <>
              <span className="flex items-center gap-2">
                Become a Truerreff Creator today –{" "}
                <span className="font-bold underline underline-offset-1">
                  DOWNLOAD NOW
                </span>
              </span>
            </>
          )}
        </div>
      </div>
      <HeroSection />
      <EarningsSection />
    </div>
  );
}
