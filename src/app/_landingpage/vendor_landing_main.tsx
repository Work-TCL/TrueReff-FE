"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import Launchpad from "./Launchpad";
import LandingPageFooter from "./LandingPageFooter";
import "aos/dist/aos.css";
import TruereffHeroSlider from "./TruereffHeroSlider";
import FaqSection from "./FAQSection";
import NavbarCommon from "./NavbarCommon";
import WhyTruereff from "./WhyTruereff";
import ZeroRiskSlider from "./ZeroRiskSlider";
import SignupFlow from "./SignupFlow";

export default function VendorLandingPage() {
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
          <div className="w-full h-full scale-150 animate-bannerFloat bg-banner-bg-4 bg-cover bg-repeat bg-center"></div>
        </div>
        <div className="absolute -left-[0px] -right-[0px] -top-[0px] -bottom-[0px] overflow-hidden bg-black/15 backdrop:blur-lg z-[7]">
          <TruereffHeroSlider isVendor={true} />
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
        <div className="flex w-max animate-marquee whitespace-nowrap gap-20 py-3 text-sm font-medium px-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <span key={idx} className="flex items-center gap-2 text-[20px]">
              Become a Truereff Partner today –{" "}
              <span className="font-bold underline underline-offset-1 text-[20px]">
                DOWNLOAD NOW
              </span>
            </span>
          ))}
        </div>
      </div>
      <WhyTruereff />
      <ZeroRiskSlider
        images={[
          "/assets/landing/zero-risk/02.png",
          "/assets/landing/zero-risk/01.png",          
        ]}
      />
      <ZeroRiskSlider
        bgColor="#9F5DE9"
        heading="Visibility + Organic Growth"
        subtext1="Not only increase your product’s visibility but also drive organic traffic directly to your website — no third-party brand dilution. "
        subtext2="Build brand recall and boost your SEO through direct creator traffic"
        images={["/assets/landing/zero-risk/visibility.svg"]}
      />
      <ZeroRiskSlider
        bgColor="#38A2F5"
        heading="No More Agencies"
        subtext1="Manage campaigns and track performance effortlessly on a single platform."
        subtext2="No middlemen. No delays. Just full control at your fingertips"
        images={["/assets/landing/zero-risk/agencies.svg"]}
      />
      <ZeroRiskSlider
        bgColor="#FF4979"
        heading="Focus on What You Do Best"
        subtext1="Concentrate on your core business while creators focus on promotion."
        subtext2="Let creators drive growth, while you scale operations."
        images={["/assets/landing/zero-risk/focus.svg"]}
      />
      <SignupFlow />
      {/* <TrustedBrands />
      <EarningsSection />
      <SocialMedia />
      <ContentCategories /> */}
      <FaqSection type="vendor" />
      <Launchpad />
      <LandingPageFooter />
    </div>
  );
}
