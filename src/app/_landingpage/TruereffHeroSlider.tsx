"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TruereffHeroSlider = () => {
  const mainSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    pauseOnHover: false,
  };

  const switchingText = ["promotions", "ghosted payments", "unfair deals"];
  const yourText = ["Influence", "Rules", "Earnings"];

  // COMMON CLASSES
  const wrapperClass =
    "h-screen w-full text-white bg-white/10 backdrop:blur-sm capitalize";
  const slideContainerClass =
    "h-screen flex items-center justify-center text-center flex-col md:space-y-6 space-y-3";
  const headlineClass =
    "text-xl sm:text-3xl md:text-5xl font-bold !leading-[1.3]";
  const highlightClass = "text-yellow-400";

  return (
    <div className={wrapperClass}>
      <Slider {...mainSettings}>
        {/* Slide 1 */}
        <div>
          <div className={slideContainerClass}>
            <div className={headlineClass}>
              Say no more to{" "}
              <span className={highlightClass}>
                <SwitchingText texts={switchingText} />
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
                <SwitchingText texts={yourText} />
              </span>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default TruereffHeroSlider;

type SwitchingTextProps = {
  texts: string[];
};

export const SwitchingText: React.FC<SwitchingTextProps> = ({ texts }) => {
  const [index, setIndex] = React.useState(0);
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShow(false); // start exit animation
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setShow(true); // start enter animation
      }, 300); // match exit duration
    }, 1500);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <span
      className={`inline-block transition-all duration-500 ease-in-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {texts[index]}
    </span>
  );
};
