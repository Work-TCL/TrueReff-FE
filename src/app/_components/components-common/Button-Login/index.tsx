"use client";



// components/AnimatedButton.tsx
import { MoveRight } from "lucide-react";
import React from "react";

interface AnimatedButtonProps {
    label: string;
    onClick?: () => void;
    className?: string;
    icon?: React.ReactNode;
    dataAos?: string;
    iconClassName?: string;
spanClassName?: string;

}

const ButtonLogin: React.FC<AnimatedButtonProps> = ({
    label,
    onClick,
    icon = <MoveRight className="text-primary transition-colors duration-300 ease-in-out" />,
    dataAos,
    iconClassName = "h-[44px] w-[44px]",
    spanClassName='',
    className = "w-[210px] h-[50px] ",
}) => {
    return (
        <button
            {...(dataAos ? { "data-aos": dataAos } : {})}
            data-aos="fade-up"
            onClick={onClick}
            className={`
        group relative flex items-center justify-between pl-6 pr-[1px] py-[1px]
        rounded-full bg-primary text-white text-base overflow-hidden border-2 border-transparent
        transition-all duration-300 ease-in-out hover:border-pink-600 
        ${className}
      `}    >
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-right transition-transform duration-700 ease-in-out group-hover:scale-x-100 z-0" />
            <span className={`relative z-10 transition-colors duration-300 ease-in-out group-hover:text-primary text-[20px] ${spanClassName}`}>
                {label}
            </span>
            <div className={`
          relative z-10 flex items-center justify-center rounded-full bg-white transition-colors duration-300 ease-in-out
          ${iconClassName}
        `}>
                {icon}
            </div>
        </button>
    );
};

export default ButtonLogin;
