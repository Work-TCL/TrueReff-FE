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
      const footerTop = footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : Infinity;

      // show when user scrolls past hero, hide when near footer
      if (
        scrollY > triggerStart &&
        scrollY + window.innerHeight < footerTop - 100
      ) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignupClick = () => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // iOS devices
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.location.href =
        "https://apps.apple.com/in/app/truereff/id6747173443";
      return;
    }

    // Android devices
    if (/android/i.test(userAgent)) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.shantanu.trureff";
      return;
    }

    // Desktop / other devices
    router.push("/register");
  };

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;

    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent,
    );
  };

  return (
    <>
      {visible && (
        <div className="fixed bottom-4 sm:bottom-6 w-full flex justify-center z-40 px-4 sm:px-6">
          <div
            data-aos="fade-up"
            className="w-[95%] bg-gray-50 flex flex-row justify-between items-center gap-3 sm:gap-4 px-2 sm:px-6 py-4 rounded-xl md:rounded-full shadow-lg border border-gray-200"
          >
            {/* Text */}
            <p className="text-center sm:text-left text-orange-700 font-medium text-lg sm:text-base leading-snug">
              {isMobileDevice() ? (
                "Join Truereff"
              ) : (
                <>
                  Accelerate your growth with{" "}
                  <span className="font-semibold">Truereff</span> (sign up now)
                </>
              )}
            </p>

            <ButtonLogin
              label={translate("Sign_up_now")}
              className={isMobileDevice() ? "w-auto h-[40px] px-4 sm:px-6": "w-[210px] h-[50px]"}
              iconClassName={isMobileDevice() ? "w-[32px] h-[32px]": "h-[44px] w-[44px]"}
              onClick={handleSignupClick}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PromoBanner;
