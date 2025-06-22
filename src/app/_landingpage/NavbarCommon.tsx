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
  };
  return (
    <nav className="relative flex justify-between items-center md:px-[50px] px-5 pb-[50px] pt-[20px] text-white z-[9] ">
      <div
        data-aos="fade-down"
        className="flex items-center gap-2 text-2xl font-bold fade lg:max-w-[352px] max-w-[160px]"
      >
        <Image
          height={50}
          width={352}
          src="/assets/common/truereff-white.svg"
          alt="Truerreff Logo"
        />
      </div>

      <div className="lg:hidden flex mt-1">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-[100px] pb-[20px] pt-[40px] right-0 px-[20px] bg-black bg-opacity-80 lg:static lg:w-auto lg:flex lg:items-center lg:gap-6 lg:bg-transparent`}
      >
        <ul className="flex flex-col lg:flex-row gap-6 text-[20px] p-6 lg:p-0">
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
