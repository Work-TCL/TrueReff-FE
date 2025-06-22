"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ZeroRiskSliderProps = {
  heading?: string;
  subtext1?: string;
  subtext2?: string;
  images: string[];
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

const ZeroRiskSlider = ({
  heading = "Zero Risk Model",
  subtext1 = "Set your own bid price and only pay for actual sales generated through creators. No results?",
  subtext2 = "No charge. Just performance-driven spending.",
  images,
  bgColor = "#FF4E80",
}: ZeroRiskSliderProps) => {
  return (
    <section
      className="py-10 sm:py-14 md:py-24 text-white overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div className="text-left mb-8 md:mb-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl xl:leading-[90px] font-bold mb-4 md:mb-[40px]">
            {heading}
          </h2>
          <p className="text-base sm:text-lg mb-3 sm:mb-4">{subtext1}</p>
          <p className="text-base sm:text-lg">{subtext2}</p>
        </div>

        {/* Image or Slider */}
        <div className="w-full">
          {images.length > 1 ? (
            <Slider {...sliderSettings}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="max-w-full bg-transparent border-0 focus-visible:border-0 focus-visible:outline-0"
                >
                  <img
                    src={img}
                    alt={`zero-risk-${idx}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={images[0]}
              alt="zero-risk"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ZeroRiskSlider;
