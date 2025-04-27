"use client";
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
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    borderRadius: "8px",
  }),
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div className="md:w-[200px] w-full relative z-[999]">
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
