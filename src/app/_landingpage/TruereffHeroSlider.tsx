"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RoleToggleTabs from "./RolesToggles";

const TruereffHeroSlider = () => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // disable built-in autoplay
    arrows: false,
    fade: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
  };

  const switchingText = ["promotions", "ghosted payments", "unfair deals"];
  const yourText = ["Influence", "Rules", "Earnings"];

  // COMMON CLASSES
  const wrapperClass =
    "h-screen w-full text-white bg-white/10 backdrop:blur-sm capitalize relative";
  const slideContainerClass =
    "h-screen flex items-center justify-center text-center flex-col md:space-y-6 space-y-3";
  const headlineClass =
    "text-xl sm:text-3xl md:text-5xl font-bold !leading-[1.3]";
  const highlightClass = "text-yellow-400";

  return (
    <div className={wrapperClass}>
      <Slider ref={sliderRef} {...mainSettings}>
        {/* Slide 1 */}
        <div>
          <div className={slideContainerClass}>
            <div className={headlineClass}>
              Say no more to{" "}
              <span className={highlightClass}>
                <SwitchingText
                  texts={switchingText}
                  onComplete={() => sliderRef.current?.slickNext()}
                />
              </span>
            </div>
            <div className="sm:text-xl md:text-3xl">
              with{" "}
              <span className={`${highlightClass} font-semibold`}>
                Truereff
              </span>
              , your content always pays.
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div>
          <div className={slideContainerClass}>
            <div className={headlineClass}>
              Stop Promoting for Free — <br />
              <span className={highlightClass}>Start Earning Like a Pro!</span>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div>
          <div className={slideContainerClass}>
            <div className={`${headlineClass} max-w-[1000px]`}>
              Join <span className={highlightClass}>Truereff</span> — <br />
              the easiest way to turn your influence into real income.
            </div>
          </div>
        </div>

        {/* Slide 4 */}
        <div>
          <div className={slideContainerClass}>
            <div className={headlineClass}>
              Your{" "}
              <span className={highlightClass}>
                <SwitchingText
                  texts={yourText}
                  onComplete={() => sliderRef.current?.slickNext()}
                />
              </span>
            </div>
          </div>
        </div>
      </Slider>
      <div className="absolute bottom-0 left-[50%] translate-x-[-50%] z-10">
        <RoleToggleTabs />
      </div>
    </div>
  );
};

export default TruereffHeroSlider;

type SwitchingTextProps = {
  texts: string[];
  onComplete: () => void;
};

export const SwitchingText: React.FC<SwitchingTextProps> = ({
  texts,
  onComplete,
}) => {
  const [index, setIndex] = React.useState(0);
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        const nextIndex = (index + 1) % texts.length;
        setIndex(nextIndex);
        setShow(true);

        if (nextIndex === 0) {
          onComplete();
        }
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [index, texts.length, onComplete]);

  return (
    <span
      className={`inline-block transition-all duration-700 ease-in-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {texts[index]}
    </span>
  );
};
