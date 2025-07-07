"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "@/app/creator/brandsList/_components/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SuggestedProducts({ data = [] }: { data: any[] }) {
  let sliderRef = useRef<any>(null);
  const next = () => {
    // @ts-ignore
    sliderRef && sliderRef?.slickNext();
  };
  const previous = () => {
    // @ts-ignore
    sliderRef && sliderRef?.slickPrev();
  };
  var settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container w-full overflow-visible h-full relative">
      <Slider
        ref={(slider) => {
          // @ts-ignore
          sliderRef = slider;
        }}
        {...settings}
      >
        {data.map((item: any, i) => (
          <div key={i} className="flex h-fit w-full">
            <ProductCard
              key={i}
              item={item}
              handleUpdateProduct={(id: string) => {
                // getBrandProductList(currentPage, true, search, vendorId);
              }}
              size="small"
            />
          </div>
        ))}
      </Slider>
      <button
        className="button absolute left-[-14px] top-32 w-8 h-8 bg-white border rounded-full flex justify-center items-center"
        onClick={previous}
      >
        <ChevronLeft />
      </button>
      <button
        className="button absolute right-[-14px] top-32 w-8 h-8 bg-white border rounded-full flex justify-center items-center"
        onClick={next}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
