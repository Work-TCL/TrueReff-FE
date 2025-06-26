import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ButtonLogin from "../_components/components-common/Button-Login";

function NavbarCommon() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("brand");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
    setIsMenuOpen(false);
    router.push(`/aboutus`);
  };
  return (
    <nav className="relative flex justify-between items-center md:px-[50px] px-5 pb-[50px] pt-[20px] text-white z-[9] ">
      <div
        data-aos="fade-down"
        className="flex items-center gap-2 text-2xl font-bold fade lg:max-w-[352px] max-w-[160px]"
      >
        <Image
          height={50}
          width={265}
          src="/assets/common/truereff-white.svg"
          alt="Truerreff Logo"
        />
      </div>

      <div className="lg:hidden flex mt-1">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
        >
          <Menu size={30} />
        </button>
      </div>

      <div
        className={`${
          isMenuOpen
            ? "translate-y-20 opacity-100 pointer-events-auto"
            : "lg:translate-y-0 -translate-y-[200px] lg:opacity-100 opacity-0 pointer-events-none"
        } fixed left-0 right-0 px-[20px] pb-[30px] pt-[30px] bg-secondary-color rounded-b-3xl 
  lg:static lg:w-auto lg:flex lg:items-center lg:gap-6 lg:bg-transparent 
  transition-all duration-700 ease-in-out transform`}
      >
        <div className="lg:hidden flex justify-between">
          <div
            data-aos="fade-down"
            className="flex items-center gap-2 text-2xl font-bold fade lg:max-w-[352px] max-w-[160px]"
          >
            <Image
              height={50}
              width={265}
              src="/assets/common/truereff-white.svg"
              alt="Truerreff Logo"
            />
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
          >
            <X size={30} />
          </button>
        </div>
        <ul className="flex flex-col lg:flex-row gap-6 text-[20px] p-6 lg:p-0 lg:mt-0 mt-3">
          {["about"].map((link) => (
            <li
              key={link}
              data-aos="fade-right"
              className="relative cursor-pointer"
              onClick={() => handleLinkClick(link)}
            >
              <span className="relative">
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </span>
              {activeLink === link && (
                <div className="w-full h-1 bg-primary rounded-sm" />
              )}
            </li>
          ))}
        </ul>

        <ButtonLogin
          label="Get Started"
          onClick={() => router.push("/login")}
        />
      </div>
    </nav>
  );
}

export default NavbarCommon;
