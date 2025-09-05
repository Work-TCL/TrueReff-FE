"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaSlidersH } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@sohanemon/utils";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { labelStyle } from "@/app/_components/ui/form/Input";
import { cities, daysFilter, indianStates, minFollowersOptions, minOrdersOptions, minRevenueOptions, sortOptions } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import { ICategory } from "./list";

type Option = {
  value: string;
  label: string;
};

interface ICreatorFilterProps {
  onChange: (values: any) => void;
  categories: ICategory[],
  parentCategory: ICategory[],
}

interface IInitialState {
  state: string;
  city: string;
  days: string;
  category: string[];
  sub_category: string[];
  minFollowers: number;
  minRevenues: number;
  minOrders: number;
  sort: string;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any, state: any) => {
    return {
      ...base,
      borderRadius: "8px",
      borderColor: state.isFocused ? "#FF4979" : base.borderColor,
      boxShadow: "none",
      "&:hover": {
        borderColor: "#FF4979",
      },
      transition: "all 0.2s ease",
      width: "250px",
    };
  },
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 73, 121, 0.1)" : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(255, 73, 121, 0.2)",
    },
    zIndex: 99999,
  }),
};
const filterCustomStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any, state: any) => {
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
    zIndex: 99999,
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
  menu: (base: any) => ({ ...base, zIndex: 99999 }),
};

const CreatorFilter: React.FC<ICreatorFilterProps> = ({ onChange,categories,parentCategory }) => {
  const translate = useTranslations();
  const [openDialog, setOpenDialog] = useState(false);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{label:string,value:string}[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<{label:string,value:string}[]>([]);

  // Temporary States for Dialog
  const initialState:IInitialState = {
    state: "",
    city: "",
    days: "",
    category: [],
    sub_category: [],
    minFollowers: 0,
    minRevenues: 0,
    minOrders: 0,
    sort: ""
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
    } else if (name === "category") {
      let selectedValue = value?.map((el:any) => el?.value);
      const optionsSubCategory = categories.filter((ele) =>
        selectedValue.includes(ele?.parentId || "")
      );
      setSubCategory(optionsSubCategory);

      // Filter selected subcategories to only include available ones
      const availableSubCategoriesIds = optionsSubCategory.map((v) => v._id);
      let selectedSubCategory = filterState.sub_category.filter((id) =>
        availableSubCategoriesIds.includes(id)
      );
      let subCats = optionsSubCategory?.filter((el:ICategory) => selectedSubCategory?.includes(el?._id))?.map(el => ({label: el?.name,value: el?._id}))
      setFilterState({ ...filterState, [name]: selectedValue,sub_category: selectedSubCategory });
      setSelectedCategory(value);
      setSelectedSubCategory(subCats)
    } else if(name === "sub_category"){
      let selectedValue = value?.map((el:any) => el?.value);
      setFilterState({ ...filterState, [name]: selectedValue });
      setSelectedSubCategory(value);
    }
    if (!isSmall) {
      onChange({ ...filterState, [name]: value });
    }
  };
  return (
    <>
    {/* Desktop view */}
    <div className="hidden lg:hidden grid-cols-1 gap-4 z-[11]">
        <Select
          name="Days"
          styles={customStyles}
          value={[
            {
              value: filterState?.days,
              label: filterState?.days ? filterState?.days : "Select Days",
            },
          ]}
          onChange={(val) => handleOnSelect(val?.value, "days")}
          options={[
            { value: "", label: "Select Days" },
            ...daysFilter
          ]}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select Days"
        />
      </div>

      {/* Mobile Button */}
      <Button
        variant="outline"
        className="text-black w-[100px] rounded-[4px] md:h-10 h-8"
        onClick={() => setOpenDialog(true)}
      >
        <FaSlidersH className="mr-1" /> {translate("Filters")}
      </Button>

      {/* Mobile Dialog */}
      <DialogLayout
        open={openDialog}
        size="!max-w-[638px] w-full overflow-visible m-2"
        title="Product Filter"
        onClose={() => setOpenDialog(false)}
      >
        <div className="bg-white rounded-2xl px-4 pb-4">
          <div className="space-y-3">
            <div>
              <label className={cn(labelStyle)}>Category</label>
              <Select
                name="category"
                styles={filterCustomStyles}
                value={selectedCategory}
                isMulti
                onChange={(val) => handleOnSelect(val, "category", true)}
                options={[
                  ...parentCategory.map((ele) => ({
                    value: ele?._id,
                    label: ele?.name,
                  })),
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Category"
              />
            </div>
            <div>
              <label className={cn(labelStyle)}>Sub Category</label>
              <Select
                name="sub_category"
                styles={filterCustomStyles}
                value={selectedSubCategory}
                isMulti
                onChange={(val) => handleOnSelect(val, "sub_category", true)}
                options={[
                  ...subCategory.map((ele) => ({
                    value: ele?._id,
                    label: ele?.name,
                  })),
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Sub Category"
              />
            </div>
            {/* <div>
              <label className={cn(labelStyle)}>Min No. of Followers</label>
              <Select
                name="minFollowers"
                styles={filterCustomStyles}
                value={[
                  {
                    value: filterState?.minFollowers,
                    label: filterState?.minFollowers
                      ? minFollowersOptions?.find(ele => ele?.value === filterState?.minFollowers)?.label
                      : "Select Followers",
                  },
                ]}
                onChange={(val) => handleOnSelect(val?.value, "minFollowers", true)}
                options={[
                        { value: "", label: "Select Followers" },
                        ...minFollowersOptions
                      ]
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Followers"
              />
            </div>
            <div>
              <label className={cn(labelStyle)}>Min No. of Revenues</label>
              <Select
                name="minRevenues"
                styles={filterCustomStyles}
                value={[
                  {
                    value: filterState?.minRevenues,
                    label: filterState?.minRevenues
                    ? minRevenueOptions?.find(ele => ele?.value === filterState?.minRevenues)?.label
                      : "Select Revenues",
                  },
                ]}
                onChange={(val) => handleOnSelect(val?.value, "minRevenues", true)}
                options={[
                  { value: "", label: "Select Revenues" },
                  ...minRevenueOptions
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Revenues"
              />
            </div>
            <div>
              <label className={cn(labelStyle)}>Min No. of Orders</label>
              <Select
                name="minOrders"
                styles={filterCustomStyles}
                value={[
                  {
                    value: filterState?.minOrders,
                    label: filterState?.minOrders
                      ? minOrdersOptions?.find(ele => ele?.value === filterState?.minOrders)?.label
                      : "Select Orders",
                  },
                ]}
                onChange={(val) => handleOnSelect(val?.value, "minOrders", true)}
                options={[
                        { value: "", label: "Select Orders" },
                        ...minOrdersOptions,
                      ]
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Orders"
              />
            </div>
            <div>
              <label className={cn(labelStyle)}>Sort</label>
              <Select
                name="sort"
                styles={filterCustomStyles}
                value={[
                  {
                    value: filterState?.sort,
                    label: filterState?.sort
                      ? sortOptions?.find(ele => ele?.value === filterState?.sort)?.label
                      : "Select Sort",
                  },
                ]}
                onChange={(val) => handleOnSelect(val?.value, "sort", true)}
                options={[
                  { value: "", label: "Select Sort" },
                  ...sortOptions
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Sort"
              />
            </div> */}

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
    </>
  );
};

export default CreatorFilter;
