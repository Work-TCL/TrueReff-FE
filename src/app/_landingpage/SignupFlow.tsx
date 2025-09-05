"use client";

import Slider from "react-slick";
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: "01",
    icon: "/assets/landing/signup-flow/01.png",
    title: "Signup",
    desc: "Using your Instagram or YouTube account",
    img: "/assets/signup-flow/screen-01.png",
  },
  {
    id: "02",
    icon: "/assets/landing/signup-flow/02.png",
    title: "Setup Profile",
    desc: "Setup your creator and storefront profile.",
    img: "/assets/signup-flow/screen-02.png",
  },
  {
    id: "03",
    icon: "/assets/landing/signup-flow/03.png",
    title: "Bid with Your Rate",
    desc: "Browse brand campaigns and bid with your rate.",
    img: "/assets/signup-flow/screen-03.png",
  },
  {
    id: "04",
    icon: "/assets/landing/signup-flow/03.png",
    title: "Bid with Your Rate",
    desc: "Browse brand campaigns and bid with your rate.",
    img: "/assets/signup-flow/screen-03.png",
  },
];

export default function SignupFlow() {
  const router = useRouter();
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.3,
    slidesToScroll: 1.7,
    arrows: false,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1.3, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <section
      className="signupflow overflow-hidden w-full relative py-10 px-4 sm:px-6 md:px-10 bg-gradient-to-br from-[#fdf4f8] via-[#fef6f1] to-white bg-no-repeat bg-center bg-cover tablet:py-14 md:py-[120px] !pb-0"
      style={{
        backgroundImage:
          "url('/assets/landing/why-truereff/bg-why-truereff.png')",
      }}
      data-aos="fade-up"
    >
      <div
        className="max-w-7xl mx-auto"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between flex-wrap gap-4 mb-10"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight font-bold mb-4 sm:mb-6">
              <span className="text-primary">Mobile</span> Signup Flow?
            </h2>
            <ButtonLogin
              label="Get Started"
              onClick={() => router.push("/login")}
            />
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 rounded-full bg-white text-primary shadow-md hover:bg-primary hover:text-white transition"
            >
              <ArrowLeft size={18} className="mx-auto" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 rounded-full bg-white text-primary shadow-md hover:bg-primary hover:text-white transition"
            >
              <ArrowRight size={18} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Slider ref={sliderRef} {...settings}>
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="px-3 sm:px-4 w-full"
              data-aos="zoom-in-up"
              data-aos-delay={`${idx * 100 + 100}`}
            >
              <div className="bg-white rounded-tl-lg rounded-tr-lg p-4 sm:p-6 text-left h-full">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-[70px] h-[70px] sm:w-[100px] sm:h-[100px]"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-700 text-xs sm:text-lg">
                      {step.id}. {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-color-200 mt-1 sm:mt-2">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="bg-gray-100 min-h-[320px] sm:min-h-[500px] rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  <img
                    src={step.img}
                    alt="Mobile Screenshot"
                    className="object-contain w-full h-full rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
