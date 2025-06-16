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

export default function LandingPage() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("creator");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
    setIsMenuOpen(false);
  };

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
      <nav className="relative flex justify-between items-center md:px-[50px] px-5 pb-[50px] pt-[20px] text-white z-[9] ">
        <div
          data-aos="fade-down"
          className="flex items-center gap-2 text-2xl font-bold fade lg:max-w-[352px] max-w-[160px]"
        >
          <Image
            height={50}
            width={352}
            src="/assets/common/truereff-white.svg"
            alt="Truerreff Logo"
          />
        </div>

        <div className="lg:hidden flex mt-1">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
          >
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        <div
          className={`${isMenuOpen ? "block" : "hidden"
            } absolute top-[100px] pb-[20px] pt-[40px] right-0 px-[20px] bg-black bg-opacity-80 lg:static lg:w-auto lg:flex lg:items-center lg:gap-6 lg:bg-transparent`}
        >
          <ul className="flex flex-col lg:flex-row gap-6 text-[20px] p-6 lg:p-0">
            {["creator", "brand", "about"].map((link) => (
              <li
                key={link}
                data-aos="fade-right"
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

          <ButtonLogin
            label="Get Started"
            onClick={() => router.push("/login")}
          />
        </div>
      </nav>
        <div className="absolute -left-[0px] -right-[0px] -top-[0px] -bottom-[0px] overflow-hidden">
          <div
            className="w-full h-full scale-150 animate-bannerFloat bg-banner-bg bg-cover bg-repeat bg-center"
          ></div>
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
        className="w-full py-[20px] text-white overflow-hidden relative z-auto"
        style={{
          background:
            "linear-gradient(to right, #9f5de9, #38a2f5, #ff4979, #fbbf12)",
        }}
      >
        <div className="flex w-max animate-marquee whitespace-nowrap gap-20 py-3 text-sm font-medium px-4">
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
      <Launchpad />
      <LandingPageFooter />
    </div>
  );
}
