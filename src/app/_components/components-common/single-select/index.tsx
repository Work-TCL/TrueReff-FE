"use client";
import { cn } from "@sohanemon/utils";
import { useState, useEffect } from "react";
import Select from "react-select";

type Option = {
  value: string;
  label: string;
};

interface SingleSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#FF4979" : base.borderColor,
    boxShadow: "none",
    "&:hover": {
      borderColor: "#FF4979",
    },
    transition: "all 0.2s ease",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 73, 121, 0.1)" : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(255, 73, 121, 0.2)",
    },
  }),
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className,
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div className={cn("md:w-[200px] w-full relative z-[12]", className)}>
      <Select
        styles={customStyles}
        value={selectedOption}
        onChange={(selected) => onChange(selected?.value || "")}
        options={options}
        isDisabled={disabled}
        className="basic-single-select focus:outline-none focus:shadow-none"
        classNamePrefix="select"
        placeholder={placeholder}
        isSearchable={false} // remove if you want search
      />
    </div>
  );
};

export default SingleSelect;
