"use client";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import ButtonLogin from "../_components/components-common/Button-Login";

const stats = [
  {
    id: "01",
    icon: "/assets/landing/why-truereff/01.png",
    count: 20000,
    suffix: "+",
    title: "Active Creators",
  },
  {
    id: "02",
    icon: "/assets/landing/why-truereff/02.png",
    count: 6,
    suffix: "Lac+",
    title: "Content Pieces",
  },
  {
    id: "03",
    icon: "/assets/landing/why-truereff/03.png",
    count: 500,
    suffix: "M+",
    title: "Total Clicks",
  },
  {
    id: "04",
    icon: "/assets/landing/why-truereff/04.png",
    count: 200,
    suffix: "M+",
    title: "Impressions",
  },
  {
    id: "05",
    icon: "/assets/landing/why-truereff/05.png",
    count: 1000,
    prefix: "₹",
    suffix: "M+",
    title: "GMV generated",
  },
];

export default function WhyTruereff() {
  const router = useRouter();
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.4,
  });

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (inView) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-10 px-4 text-center bg-gradient-to-br from-[#fdf4f8] via-[#fef6f1] to-white bg-no-repeat bg-center bg-cover tablet:py-14 md:py-[120px]"
      style={{
        backgroundImage:
          "url('/assets/landing/why-truereff/bg-why-truereff.png')",
      }}
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div
          className="flex flex-col items-center justify-center mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            <span className="text-primary font-bold">Why</span> truereff?
          </h2>
          <p className="text-gray-color-200 text-base tablet:text-lg md:text-xl py-4 max-w-3xl">
            Truereff is India’s trusted platform connecting top creators with
            brands to deliver authentic content and guaranteed sales. Join
            thousands of brands who grow faster with performance-driven
            influencer campaigns and transparent results.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-6 gap-6">
          {stats.map((item, index) => {
            let colSpan = "col-span-6";

            if (index < 3) {
              colSpan = "md:col-span-3 lg:col-span-2";
            } else {
              colSpan = "md:col-span-3 lg:col-span-3";
            }

            return (
              <div
                key={item.id}
                className={`${colSpan} flex flex-col justify-between p-6 bg-white rounded-xl shadow-md`}
                data-aos="zoom-in"
                data-aos-delay={`${index * 100}`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] flex items-center justify-center rounded-full">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl text-[#00000066] font-semibold">
                    {item.id}
                  </span>
                </div>
                <div className="text-left mt-6">
                  <h3 className="text-2xl sm:text-3xl tablet:text-4xl md:text-5xl xl:text-6xl font-bold text-primary">
                    {item.prefix}
                    <CountUp
                      key={`${item.id}-${animationKey}`}
                      start={0}
                      end={item.count}
                      duration={2}
                    />
                    {item.suffix}
                  </h3>
                  <p className="text-sm sm:text-base tablet:text-lg text-gray-color-200 mt-3 font-medium">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <div
          className="mt-10 flex justify-center items-center w-full"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <ButtonLogin
            label="Get Started"
            onClick={() => router.push("/login")}
          />
        </div>
      </div>
    </section>
  );
}
