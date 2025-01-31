"use client";
import { cn } from "@sohanemon/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";

let allTabs = [
    {
        id: "1",
        name: "Business Information",
        Icon: HiOutlineSquare3Stack3D
    },
    {
        id: "2",
        name: "Contact Details",
        Icon: HiOutlineSquare3Stack3D
    },
    {
        id: "3",
        name: "Omni-channel",
        Icon: HiOutlineSquare3Stack3D
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
        <div className="flex relative items-center justify-between">
            <span
                className="absolute bottom-0 top-0 -z-10 flex overflow-hidden  py-2 transition-all duration-300"
                style={{ left: tabUnderlineLeft - 15, width: tabUnderlineWidth + 30 }}
            >
                <span className="h-full w-full border-b-2 border-primary-color " />
            </span>
            <span
                className="absolute bottom-0 top-0 right-0 -z-10 flex overflow-hidden py-2 transition-all duration-300"
            >
                <span className="h-full w-full border-b-2 border-gray-color " />
            </span>
            {allTabs.map((tab, index) => {
                const isActive = activeTabIndex === index;
                const Icon = tab.Icon
                return (
                    <div className="p-5" key={index}>
                        <button
                            ref={(el) => { tabsRef.current[index] = el; }}
                            className={`${isActive ? 'text-primary-color' : 'text-gray-color'
                                } flex items-center gap-3 text-lg select-none text-center font-light transition-all duration-300 transform ${isActive ? 'scale-105' : 'hover:scale-105'
                                }`}

                            onClick={() => setActiveTabIndex(index)}

                        >
                            <Icon className={cn('text-lg', isActive ? 'text-primary-color' : 'text-gray-color')} />
                            <span className="hidden md:block">Business Name
                            </span>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
