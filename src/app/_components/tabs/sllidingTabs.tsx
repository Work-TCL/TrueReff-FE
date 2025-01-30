"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

let allTabs = [
    {
        id: "home",
        name: "Home",
    },
    {
        id: "blog",
        name: "Blog",
    },
    {
        id: "projects",
        name: "Projects",
    }
];

export const SlidingTabBar = () => {
    const tabsRef = useRef<(HTMLElement | null)[]>([]);
    const [activeTabIndex, setActiveTabIndex] = useState<number | null>(0);
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
        <div className="flex relative mx-auto items-center justify-between shadow-sm border-b border-[#E9EAF0] bg-transparent">
            <span
                className="absolute bottom-0 top-0 -z-10 flex overflow-hidden  py-2 transition-all duration-300"
                style={{ left: tabUnderlineLeft - 15, width: tabUnderlineWidth + 30 }}
            >
                <span className="h-full w-full border-b-2 border-primary-color " />
            </span>
            {allTabs.map((tab, index) => {
                const isActive = activeTabIndex === index;
                return (
                    <div className="p-5" key={index}>
                        <button
                            ref={(el) => { tabsRef.current[index] = el; }}
                            className={`${isActive ? 'text-primary-color' : 'text-gray-color'
                                } flex items-center gap-3 text-lg select-none text-center font-light transition-all duration-300 transform ${isActive ? 'scale-105' : 'hover:scale-105'
                                }`}
                                style={{ color: isActive ? '#yourActiveColor' : '#yourInactiveColor' }} // Add this line

                            onClick={() => setActiveTabIndex(index)}

                        >
                            <Image src="/file.svg" alt="back" width={24} height={24} />
                            <span className="hidden md:block">Business Name
                            </span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
