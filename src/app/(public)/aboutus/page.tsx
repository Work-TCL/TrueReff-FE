"use client"
import HeaderAuth from "@/app/_components/pages/auth/components/header-auth";
import LandingPageFooter from "@/app/_landingpage/LandingPageFooter";
import Launchpad from "@/app/_landingpage/Launchpad";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter()
  return (
    <div className="bg-white text-gray-800">
      {/* <!-- Header --> */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center gap-3">
          <img
            alt="TrueReff"
            className="md:w-fit sm:max-w-[203px] w-fit max-w-[160px] mr-auto"
            src="/assets/common/truereff-dark.svg"
            onClick={() => router?.push('/')}
          />
        </div>
      </header>

      <h1 className="md:text-5xl sm:text-4xl text-3xl font-bold text-center md:pt-[64px] md:pb-[60px] pb-4 pt-3">
            About <span className="text-primary">Us</span>
          </h1>
       

      {/* <!-- Terms Content --> */}
       <main className="bg-white flex items-center flex-col py-5 px-4 md:pb-[140px] pb-5 sm:px-8 lg:px-16">
        
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text section */}
        <div className="space-y-5">
          <h1 className="md:text-3xl sm:text-2xl text-xl font-bold">
            Our story
          </h1>
          <div className="space-y-4 leading-relaxed text-[#636366]">
            <p>
              Truereff is a forward-thinking company dedicated to empowering creators and brands through innovative digital solutions. Founded on the principles of transparency, efficiency, and results, Truereff is transforming the way influencer marketing and brand collaborations work in the modern age.
            </p>
            <p>
              We bridge the gap between creators and businesses by providing seamless tools that ensure fair value, measurable impact, and authentic partnerships. Whether you're a content creator looking to monetize your influence or a brand aiming to reach the right audience, Truereff delivers a streamlined platform that puts performance and trust at the core.
            </p>
            <p>
              At Truereff, we believe the future of marketing lies in real engagement — not just reach. That’s why we focus on building data-driven strategies, fostering genuine creator-brand relationships, and delivering outcomes that matter.
            </p>
            <p>
              Join us as we redefine the standards of digital collaboration.
            </p>
            <p>
              If you have any questions, please contact us at{" "}
              <span className="text-primary font-medium">info@truereff.com</span>.
            </p>
          </div>
        </div>

        {/* Image section */}
        <div className="flex gap-4 justify-center">
          <div className="relative">
            <img
              src="/assets/common/aboutus.png"
              alt="Creator Image 1"
              className="w-full h-full rounded-3xl object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-3xl"></div>
          </div>
        </div>
      </div>
    </main>
      {/* <Launchpad /> */}
      <LandingPageFooter isLanginPage={false} />
    </div>
  );
}

export default page;
