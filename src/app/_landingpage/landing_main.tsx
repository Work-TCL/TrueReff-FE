"use client";

import { MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import HeroSection from "./heroSection";
import EarningsSection from "./earningsSection";
import SocialMedia from "./SocialMediaSections";
import AOS from 'aos';
import ContentCategories from "./ContentCategories";
import Launchpad from "./Launchpad";
import LandingPageFooter from "./LandingPageFooter";
import "aos/dist/aos.css";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("creator");

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
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
    <div className="relative w-full h-screen  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
        <div data-aos="fade-down" className="flex items-center gap-2 text-2xl font-bold fade">
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

         <ButtonLogin label="Get Started" dataAos="fade-up" onClick={() => {router.push("/login")}} />

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
      <SocialMedia />
      <ContentCategories />
      <Launchpad />
      <LandingPageFooter />
    </div>
  );
}
