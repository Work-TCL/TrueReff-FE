"use client";
import { Menu, X, MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import HeroSection from "./heroSection";
import EarningsSection from "./earningsSection";
import SocialMedia from "./SocialMediaSections";
import AOS from "aos";
import ContentCategories from "./ContentCategories";
import Launchpad from "./Launchpad";
import LandingPageFooter from "./LandingPageFooter";
import "aos/dist/aos.css";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TruereffHeroSlider from "./TruereffHeroSlider";
import FaqSection from "./FAQSection";
import NavbarCommon from "./NavbarCommon";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 1600,
      once: false,
      mirror: true,
      // easing: 'ease-in-out',
    });
  }, []);

  return (
    <div className="relative w-full h-screen  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] landing-wrapper">
      <div className="relative w-full h-screen  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] landing-wrapper">
        {/* Navbar */}
        <NavbarCommon />
        <div className="absolute -left-[0px] -right-[0px] -top-[0px] -bottom-[0px] overflow-hidden z-[6] ">
          <div className="w-full h-full scale-150 animate-bannerFloat bg-banner-bg bg-cover bg-repeat bg-center"></div>
        </div>
        <div className="absolute -left-[0px] -right-[0px] -top-[0px] -bottom-[0px] overflow-hidden bg-black/15 backdrop:blur-lg z-[7]">
          <TruereffHeroSlider />
        </div>
      </div>

      {/* Background Video */}

      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div
          className="w-full h-full animate-bannerMove scale-150"
          style={{
            backgroundImage: "url('/assets/common/banner-bg.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
      </div> */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/assets/landing/landingVideo.mp4" type="video/mp4" />
      </video> */}
      {/* <Image
        height={1080}
        width={1920}
        src="/assets/common/truereff-white.svg"
        alt="Truerreff Logo"
      /> */}

      {/* Marquee Section */}
      <div
        className="w-full py-[10px] text-white overflow-hidden relative z-auto"
        style={{
          background:
            "linear-gradient(to right, #9f5de9, #38a2f5, #ff4979, #fbbf12)",
        }}
      >
        <div className="flex w-max animate-marquee whitespace-nowrap gap-20 py-2 text-sm font-medium px-4">
          {Array(10).fill(
            <>
              <span className="flex items-center gap-2 text-[20px]">
                Become a Truerreff Creator today –{" "}
                <span className="font-bold underline underline-offset-1 ext-[20px]">
                  DOWNLOAD NOW
                </span>
              </span>
            </>
          )}
        </div>
      </div>
      <HeroSection />
      <EarningsSection />
      <SocialMedia />
      <ContentCategories />
      <FaqSection type="creator" />
      <Launchpad />
      <LandingPageFooter />
    </div>
  );
}
