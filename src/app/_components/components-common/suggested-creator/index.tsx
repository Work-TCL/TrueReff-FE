"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreatorCard from "../../pages/creator/creator-card";
import CollaborateRequest from "../dialogs/collaborate-creator-form";
import { ArrowLeftIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function SuggestedCreators({ data = [] }: { data: any[] }) {
  const initialValue = { show: false, creatorId: "" };
  let sliderRef = useRef<any>(null);
  const next = () => {
    // @ts-ignore
    sliderRef && sliderRef?.slickNext();
  };
  const previous = () => {
    // @ts-ignore
    sliderRef && sliderRef?.slickPrev();
  };
  const [isOpen, setIsOpen] = useState(initialValue);
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
    <div className="slider-container w-full overflow-visible h-full relative group">
      <Slider
        ref={(slider) => {
          // @ts-ignore
          sliderRef = slider;
        }}
        {...settings}
      >
        {data.map((item: any, i) => (
          <div key={i} className="flex h-fit w-full px-2">
            <CreatorCard
              item={item}
              handleCollaborateNow={(creatorId: string) => {
                setIsOpen({ show: true, creatorId });
              }}
              size="small"
              isCategoryShow={false}
            />
          </div>
        ))}
      </Slider>
      {isOpen?.show && (
        <CollaborateRequest
          open={isOpen?.show}
          onClose={() => {
            setIsOpen(initialValue);
          }}
          creatorId={isOpen?.creatorId}
        />
      )}
      {/* <div className="absolute top-0"> */}
      <button
        className="button absolute left-[-12px] top-32 w-8 h-8 bg-white border rounded-full flex justify-center items-center"
        onClick={previous}
      >
        <ChevronLeft />
      </button>
      <button
        className="button absolute right-[-12px] top-32 w-8 h-8 bg-white border rounded-full flex justify-center items-center"
        onClick={next}
      >
        <ChevronRight />
      </button>
      {/* </div> */}
    </div>
  );
}
