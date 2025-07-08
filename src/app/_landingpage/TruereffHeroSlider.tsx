"use client";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RoleToggleTabs from "./RolesToggles";

interface ITrueReffSliderProps {
  isVendor?: boolean;
}
const TruereffHeroSlider = ({ isVendor }: ITrueReffSliderProps) => {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSettingsVendor = {
    dots: false,
    infinite: true,
    speed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // disable built-in autoplay
    arrows: false,
    fade: false,
  };

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
    "text-xl sm:text-3xl xl:text-5xl lg:text-4xl font-bold !leading-[1.3] transition-all duration-700 ease-in-out transform";

  const highlightClass = "text-yellow-400";

  return (
    <div className={wrapperClass}>
      {isVendor ? (
        <Slider ref={sliderRef} {...mainSettingsVendor}>
          {/* Slide 1 */}
          <div>
            <div className={slideContainerClass}>
              <div className={`${headlineClass}`}>
                Stop Paying for Hype{", "}
                <span className={`${highlightClass}`}>
                  Start Paying for Sales.
                </span>
              </div>
              <div className="sm:text-xl md:text-3xl xl:!mt-5 !mt-1">
                With{" "}
                <span className={`${highlightClass} font-semibold`}>
                  Truereff
                </span>
                , every rupee works harder.
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div>
            <div className={slideContainerClass}>
              <div className={headlineClass}>
                Forget Fake Influencers — <br />
                <span className={highlightClass}>
                  Back Real Results with Truereff.
                </span>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div>
            <div className={slideContainerClass}>
              <div className={`${headlineClass} max-w-[1000px]`}>
                No Sales? <span className={highlightClass}> No Payment.</span>
                <br />
                It’s That Simple with Truereff.
              </div>
            </div>
          </div>

          {/* Slide 4 */}
          <div>
            <div className={slideContainerClass}>
              <div className={headlineClass}>
                Zero Upfront Cost{", "}
                <span className={highlightClass}>
                  Unlimited Sales Potential.
                </span>
                <br />
                Only on Truereff.
              </div>
            </div>
          </div>
        </Slider>
      ) : (
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
                    className="sm:w-[400px] w-[180px] text-left text-nowrap overflow-visible"
                  />
                </span>
              </div>
              <div className="sm:text-xl md:text-3xl xl:!mt-5 !mt-1">
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
                <span className={highlightClass}>
                  Start Earning Like a Pro!
                </span>
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
                    className="sm:w-[220px] w-[100px] text-left text-nowrap overflow-visible"
                  />
                </span>
              </div>
            </div>
          </div>
        </Slider>
      )}
      <div className="absolute bottom-0 left-[50%] translate-x-[-50%] z-10">
        <RoleToggleTabs />
      </div>
    </div>
  );
};

export default TruereffHeroSlider;

type SwitchingTextProps = {
  className: string;
  texts: string[];
  onComplete: () => void;
};

export const SwitchingText: React.FC<SwitchingTextProps> = ({
  texts,
  onComplete,
  className = "",
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

        if (nextIndex === texts.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [index, texts.length, onComplete]);

  return (
    <span
      className={`inline-block transition-all duration-700 ease-in-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${className}`}
    >
      {texts[index]}
    </span>
  );
};
