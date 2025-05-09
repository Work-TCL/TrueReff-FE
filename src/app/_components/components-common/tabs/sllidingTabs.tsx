"use client";
import { cn } from "@sohanemon/utils";
import React from "react";

interface ISlidingTabBar {
  tabs: {
    id: string;
    name: string;
    Icon: React.Component;
  }[];
  activeTabIndex: number;
  grid: number;
  setActiveTabIndex: (val: number) => void;
}

export const SlidingTabBar = ({
  tabs = [],
  grid = 3,
  activeTabIndex,
  setActiveTabIndex,
}: ISlidingTabBar) => {
  return (
    <div className={`relative flex`}>
      <span
        className="absolute bottom-0 top-0 -z-10 flex overflow-hidden  py-2 transition-all duration-300"
        style={{
          left: `${activeTabIndex * (100 / grid)}%`,
          width: `${100 / grid}%`,
        }}
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
              className={`${
                isActive ? "text-primary-color" : "text-gray-color"
              } text-nowrap flex items-center justify-center md:gap-3 gap-1 lg:text-lg md:text-base text-xs truncate select-none text-center font-light transition-all duration-300 transform w-full ${
                isActive ? "scale-105" : "hover:scale-105"
              }`}
              onClick={() =>
                index < activeTabIndex ? setActiveTabIndex(index) : null
              }
            >
              <Icon
                className={cn(
                  "text-lg",
                  isActive ? "text-primary-color" : "text-gray-color"
                )}
              />
              <span className="truncate sm:block hidden">{tab.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
