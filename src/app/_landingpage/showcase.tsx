"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ZeroRiskSliderProps = {
  heading?: string;
  subtext1?: string;
  image?: string;
  bgColor?: string;
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 4000,
};

const ShowCaseCreatorStore = ({
  heading = "Showcase with Your Creator Store",
  subtext1 = "Build your own personalized storefront to feature and promote your favorite products, making it easy for your audience to shop what you trust.",
  image = "/assets/creator/showcase.svg",
  bgColor = "#9F5DE9",
}: ZeroRiskSliderProps) => {
  return (
    <section
      className="py-10 sm:py-14 md:py-24 text-white overflow-hidden"
      style={{ backgroundColor: bgColor }}
      data-aos="fade-up"
    >
      <div
        className="max-w-7xl mx-auto xl:px-4 px-8 flex flex-col md:flex-row md:justify-between xl:gap-20 gap-8 items-center"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        {/* Text Content */}
        <div
          className="text-left mb-8 md:mb-0"
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl xl:leading-[90px] font-bold mb-4 md:mb-[40px]">
            {heading}
          </h2>
          <p className="text-base sm:text-lg mb-3 sm:mb-4">{subtext1}</p>
        </div>

        {/* Image or Slider */}
        <div
          className="w-full max-w-[330px] xsmobile:max-w-[260px]"
          data-aos="fade-left"
          data-aos-delay="300"
        >
          <img
            src={image}
            alt="zero-risk"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default ShowCaseCreatorStore;
