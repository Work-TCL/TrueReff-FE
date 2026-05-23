"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IMediaTemplateCard } from "@/lib/web-api/replayzap";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff } from "lucide-react";

interface ICarouselPreviewProps {
  cards: IMediaTemplateCard[];
  dmMessage?: string;
}

export default function CarouselPreview({
  cards,
  dmMessage,
}: ICarouselPreviewProps) {
  const translate = useTranslations();
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(cards.length - 1, i + 1));

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 xl:p-6 flex flex-col gap-4">
      <h3 className="text-sm font-medium">{translate("DM_Preview")}</h3>

      {/* Phone mockup */}
      <div className="bg-gray-100 rounded-2xl p-4 max-w-[320px] mx-auto w-full">
        {/* Chat bubble - DM message */}
        {dmMessage && (
          <div className="bg-blue-500 text-white text-xs p-3 rounded-2xl rounded-bl-sm mb-3 max-w-[85%]">
            {dmMessage}
          </div>
        )}

        {/* Carousel */}
        <div className="relative">
          {cards.length > 0 && (
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {/* Image */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {cards[activeIndex]?.imageUrl ? (
                  <img
                    src={cards[activeIndex].imageUrl}
                    alt={cards[activeIndex].headline}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff className="w-10 h-10 text-gray-300" />
                )}
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {cards[activeIndex]?.headline || "Product Name"}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {cards[activeIndex]?.description || "Product description"}
                </p>

                {/* Button */}
                {cards[activeIndex]?.buttons?.[0] && (
                  <div className="mt-2 flex items-center justify-center gap-1 py-2 border-t border-gray-100 text-blue-500 text-xs font-medium">
                    <ExternalLink size={12} />
                    {cards[activeIndex].buttons[0].title || "Shop Now"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          {cards.length > 1 && (
            <>
              <button
                onClick={prev}
                disabled={activeIndex === 0}
                className="absolute left-1 top-1/3 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={next}
                disabled={activeIndex === cards.length - 1}
                className="absolute right-1 top-1/3 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {cards.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-primary-color w-4" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        {translate("Preview_Note")}
      </p>
    </div>
  );
}
