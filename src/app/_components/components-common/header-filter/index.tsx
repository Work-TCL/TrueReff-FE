"use client";
import { useAuthStore } from "@/lib/store/auth-user";
import React, { useState } from "react";
import Select from "react-select";
import { overviewFilter } from "../../pages/overview";
import { creatorDashboardFilter } from "../../pages/dashboard";

const options = [
  { value: "7", label: "7 Days" },
  { value: "15", label: "15 Days" },
  { value: "30", label: "30 Days" },
  { value: "all", label: "All Days" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    minHeight: "auto",
    cursor: "pointer",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#FF4979",
    padding: 4,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  input: (provided: any) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: "#FF4979",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#FF4979",
    textWrap: "text-nowrap",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 10,
  }),
  option: (provided: any, state: { isSelected: any; isFocused: any }) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#FF4979"
      : state.isFocused
      ? "#ffe5ec"
      : "white",
    color: state.isSelected ? "white" : "#FF4979",
    textWrap: "text-nowrap",
    cursor: "pointer",
  }),
};

export default function HeaderFilter() {
  const [selected, setSelected] = useState(options[0]);
  const { account } = useAuthStore();
  const isCreator = account?.role === "creator";

  const handleChange = (selected: any) => {
    console.log("selected", selected, isCreator);
    if (selected?.value) {
      setSelected(selected);
      if (isCreator) {
        creatorDashboardFilter?.next(selected?.value || "7");
      } else {
        overviewFilter?.next(selected?.value || "7");
      }
    }
  };
  return (
    <div className="text-nowrap sm:min-w-24 min-w-20 sm:text-base text-sm">
      <Select
        options={options}
        styles={customStyles}
        placeholder="Select..."
        isSearchable={false}
        value={selected}
        onChange={handleChange}
      />
    </div>
  );
}
