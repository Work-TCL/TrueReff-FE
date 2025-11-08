"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import AOS from "aos";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Button from "../../ui/button";
import { useAuthStore } from "@/lib/store/auth-user";
import axios from "@/lib/web-api/axios";
import { youtubeVideoUrls } from "@/lib/utils/constants";


const WatchHowModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const translate = useTranslations();
    const { account } = useAuthStore();

    useEffect(() => {
        // Initialize AOS
        AOS.init({ duration: 600, easing: "ease-out-cubic" });
    }, []);

    // Detect scroll -> delay -> show modal
    useEffect(() => {
        let openCount = account?.videoCount ?? 0;
        const opened = sessionStorage.getItem("WatchHowModalOpened");
        // Don't start interval if it already opened 3 times
        if (openCount >= 3 || opened === "true") return;
        setTimeout(() => {
            sessionStorage.setItem("WatchHowModalOpened", "true");
            setIsOpen(true);
        }, 10000); // every 10 seconds
    }, []);

    const setVideoCount = async () => {
        try {
            await axios.post('/auth/user/video-count/add');
        } catch (error) {
            console.error("Error incrementing video count:", error);
        }
    };
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div
                        ref={modalRef}
                        data-aos="fade-up"
                        className="relative bg-white w-11/12 sm:w-[400px] md:w-[450px] rounded-lg shadow-lg p-6 sm:p-8"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setVideoCount();
                            }}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Form Heading */}
                        <div className="mb-4">
                            <h1 className="text-2xl font-semibold text-secondary text-center">
                                How {account?.role === "creator" ? "Creator" : "Brand"} panel works?
                            </h1>
                        </div>
                        <div className="bg-white flex justify-center">
                            <Link target="_blank" href={account?.role === "creator" ? youtubeVideoUrls?.creatorPanelWorkflow : youtubeVideoUrls?.vendorPanelWorkflow} onClick={() => setVideoCount()}
                                className="ml-2 flex items-center gap-1 text-white bg-primary px-3 py-3 rounded-lg text-xs hover:bg-opacity-60 transition"
                            >
                                ▶ Watch Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WatchHowModal;