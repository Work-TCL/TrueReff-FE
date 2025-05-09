"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaSlidersH } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@sohanemon/utils";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { labelStyle } from "@/app/_components/ui/form/Input";
import { cities, indianStates } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";

type Option = {
  value: string;
  label: string;
};

interface IBrandFilterProps {
  onChange: (values: any) => void;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem", // Tailwind text-sm
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
    width: "250px",
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
const filterCustomStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any, state: any) => {
    console.log("state", state.selectProps);
    return {
      ...base,
      borderRadius: "8px",
      borderColor: state.isFocused ? "#FF4979" : base.borderColor,
      boxShadow: "none",
      "&:hover": {
        borderColor: "#FF4979",
      },
      transition: "all 0.2s ease",
    };
  },
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 73, 121, 0.1)" : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(255, 73, 121, 0.2)",
    },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  menu: (base: any) => ({ ...base, zIndex: 9999, position: "absolute" }),
};
const BrandFilter: React.FC<IBrandFilterProps> = ({ onChange }) => {
  const translate = useTranslations();
  const [openDialog, setOpenDialog] = useState(false);

  // Temporary States for Dialog
  const initialState = {
    state: "",
    city: "",
  };
  const [filterState, setFilterState] = useState(initialState);

  const handleApplyFilters = async () => {
    onChange(filterState);
    setOpenDialog(false);
  };
  const handleOnSelect = (value: any, name: any, isSmall: boolean = false) => {
    setFilterState({ ...filterState, [name]: value });
    if (name === "state") {
      setFilterState({ ...filterState, [name]: value, city: "" });
    }
    if (!isSmall) {
      onChange({ ...filterState, [name]: value });
    }
  };
  return (
    <>
      {/* Mobile Button */}
      <Button
        variant="outline"
        className="text-black w-[100px] rounded-[4px] md:h-10 h-8 lg:hidden"
        onClick={() => setOpenDialog(true)}
      >
        <FaSlidersH className="mr-1" /> {translate("Filters")}
      </Button>

      {/* Mobile Dialog */}
      <DialogLayout
        open={openDialog}
        size="!max-w-[638px] w-full overflow-visible lg:hidden"
        title="Product Filter"
        onClose={() => setOpenDialog(false)}
      >
        <div className="bg-white rounded-2xl p-4 lg:hidden">
          <div className="space-y-6">
            <div>
              <label className={cn(labelStyle)}>State</label>
              <Select
                styles={filterCustomStyles}
                value={[
                  {
                    value: filterState?.state,
                    label: filterState?.state
                      ? filterState?.state
                      : "Select State",
                  },
                ]}
                onChange={(val) => handleOnSelect(val?.value, "state", true)}
                options={[
                  { value: "", label: "Select State" },
                  ...indianStates.map((ele) => ({
                    value: ele,
                    label: ele,
                  })),
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="State"
                isClearable
              />
            </div>
            <div>
              <label className={cn(labelStyle)}>City</label>
              <Select
                styles={filterCustomStyles}
                value={[
                  {
                    value: filterState?.city,
                    label: filterState?.city
                      ? filterState?.city
                      : "Select City",
                  },
                ]}
                onChange={(val) => handleOnSelect(val?.value, "city", true)}
                options={
                  filterState.state
                    ? [
                        { value: "", label: "Select City" },
                        ...cities[filterState.state].map((ele: any) => ({
                          value: ele,
                          label: ele,
                        })),
                      ]
                    : []
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="City"
                isClearable
              />
            </div>

            {/* OK Button */}
            <Button
              onClick={handleApplyFilters}
              className="w-full bg-primary text-white rounded-md"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogLayout>

      {/* Desktop view */}
      <div className="hidden lg:grid grid-cols-2 gap-4 relative z-[999]">
        <Select
          styles={customStyles}
          value={[
            {
              value: filterState?.state,
              label: filterState?.state ? filterState?.state : "Select State",
            },
          ]}
          onChange={(val) => handleOnSelect(val?.value, "state")}
          options={[
            { value: "", label: "Select State" },
            ...indianStates.map((ele) => ({
              value: ele,
              label: ele,
            })),
          ]}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="State"
          isClearable
        />
        <Select
          styles={customStyles}
          value={[
            {
              value: filterState?.city,
              label: filterState?.city ? filterState?.city : "Select City",
            },
          ]}
          onChange={(val) => handleOnSelect(val?.value, "city")}
          options={
            filterState.state
              ? [
                  { value: "", label: "Select City" },
                  ...cities[filterState.state].map((ele: any) => ({
                    value: ele,
                    label: ele,
                  })),
                ]
              : []
          }
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select City"
          isClearable
        />
      </div>
    </>
  );
};

export default BrandFilter;
