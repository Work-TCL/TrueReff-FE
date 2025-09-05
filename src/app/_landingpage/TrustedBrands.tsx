// components/TrustedBrands.tsx
import Image from "next/image";
import React from "react";

const logos = [
  "/assets/landing/amazon.svg",
  "/assets/landing/banggood.svg",
  "/assets/landing/clovia.svg",
  "/assets/landing/micas.svg",
  "/assets/landing/myntra.svg",
];

const TrustedBrands = () => {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div data-aos="zoom-in-up" className="flex justify-center">
        <h2 className="text-xl md:text-4xl font-bold">
          <span className="text-pink-500">Trusted</span> By Leading Brands
        </h2>
        </div>

        <div className="mt-10 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-marquee gap-12 w-max">
            {[...logos,...logos,...logos,...logos,...logos,...logos].map((src, index) => (
              <Image
                key={index}
                src={src}
                width={150}
                height={50}
                alt={`Brand logo ${index}`}
                className="  transition duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;