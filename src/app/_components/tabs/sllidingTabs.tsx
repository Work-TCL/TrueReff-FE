"use client";
import { cn } from "@sohanemon/utils";
import React, { useEffect, useRef, useState } from "react";

interface ISlidingTabBar {
  tabs: {
    id: string;
    name: string;
    Icon: React.Component;
  }[];
  activeTabIndex: number;
  setActiveTabIndex: (val: number) => void;
}

export const SlidingTabBar = ({
  tabs = [],
  activeTabIndex,
  setActiveTabIndex,
}: ISlidingTabBar) => {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);

  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  useEffect(() => {
    if (activeTabIndex === null) {
      return;
    }

    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeTabIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };

    setTabPosition();
  }, [activeTabIndex]);

  return (
    <div className="relative grid grid-cols-3">
      <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden  py-2 transition-all duration-300"
        style={{ left: tabUnderlineLeft - 0, width: "28%" }}
      >
        <span className="h-full w-full border-b-2 border-primary-color " />
      </span>
      <span className="absolute bottom-0 top-0 right-0 -z-10 flex overflow-hidden py-2 transition-all duration-300">
        <span className="h-full w-full border-b-2 border-gray-color " />
      </span>
      {tabs.map((tab, index) => {
        const isActive = activeTabIndex === index;
        const Icon: any = tab.Icon;
        return (
          <div className="py-5 md:px-5 px-2 w-full" key={index}>
            <button
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              className={`${
                isActive ? "text-primary-color" : "text-gray-color"
              } text-nowrap flex items-center md:justify-center md:gap-3 gap-1 lg:text-lg md:text-base text-xs truncate select-none text-center font-light transition-all duration-300 transform w-full ${
                isActive ? "scale-105" : "hover:scale-105"
              }`}
              onClick={() =>
                index < activeTabIndex ? setActiveTabIndex(index) : null
              }
            >
              <Icon
                className={cn(
                  "lg:text-lg text-base",
                  isActive ? "text-primary-color" : "text-gray-color"
                )}
              />
              <span className="truncate">{tab.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
