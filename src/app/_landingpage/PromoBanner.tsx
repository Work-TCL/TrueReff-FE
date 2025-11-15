"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ButtonLogin from "../_components/components-common/Button-Login";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const PromoBanner = () => {
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const translate = useTranslations();

    useEffect(() => {
        // AOS.init({ duration: 1600, once: true });
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerStart = window.innerHeight * 0.6; // when user scrolls ~60% of viewport
            const footer = document.querySelector("#landing-footer");
            const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : Infinity;

            // show when user scrolls past hero, hide when near footer
            if (scrollY > triggerStart && scrollY + window.innerHeight < footerTop - 100) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // run on load

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {visible && (
                <div className="fixed bottom-4 sm:bottom-6 w-full flex justify-center z-40 px-3 sm:px-6">
      <div
        data-aos="fade-up"
        className="w-[95%] bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 px-2 sm:px-6 py-4 rounded-xl md:rounded-full shadow-lg border border-gray-200"
      >
        {/* Text */}
        <p className="text-center sm:text-left text-orange-700 font-medium text-sm sm:text-base leading-snug">
          Accelerate your growth with{" "}
          <span className="font-semibold">Truereff</span> (sign up now)
        </p>

                        <ButtonLogin
                            label={translate("Sign_up_now")}
                            onClick={() => router.push("/register")}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PromoBanner;