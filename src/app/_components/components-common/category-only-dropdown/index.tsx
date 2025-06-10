"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaSlidersH } from "react-icons/fa";
import DialogLayout from "../../ui/layout/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@sohanemon/utils";
import { labelStyle } from "../../ui/form/Input";
import { getCategories } from "@/lib/web-api/auth";
import { ICategory } from "../../pages/product-management";
import { useTranslations } from "next-intl";

type Option = {
  value: string;
  label: string;
};

interface CategorySubCategorySelectProps {
  onChange: (value: string) => void;
  xlBreakPoint?: boolean;
}

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem",
    color: "#a1a1aa",
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
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
  menu: (base: any) => ({ ...base, zIndex: 99999 }),
};

const CategorySubCategorySelect: React.FC<CategorySubCategorySelectProps> = ({
  onChange,
  xlBreakPoint,
}) => {
  const translate = useTranslations();
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tempSelectedCategory, setTempSelectedCategory] = useState<
    string | null
  >(null);

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setCategories(data);
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    onChange(id); // Pass selected category
  };

  const handleTempCategoryChange = (id: string) => {
    setTempSelectedCategory(id);
  };

  const handleApplyFilters = () => {
    handleCategoryChange(tempSelectedCategory || "");
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (openDialog) {
      setTempSelectedCategory(selectedCategory);
    }
  }, [openDialog]);

  return (
    <>
      {/* Mobile Button */}
      <Button
        variant="outline"
        className={cn(
          "text-black w-[100px] rounded-[4px] md:h-10 h-8",
          xlBreakPoint ? " 2xl:hidden" : " lg:hidden"
        )}
        onClick={() => setOpenDialog(true)}
      >
        <FaSlidersH className="mr-1" /> {translate("Filters")}
      </Button>

      {/* Mobile Dialog */}
      <DialogLayout
        open={openDialog}
        size="!max-w-[638px] w-full overflow-auto m-2 lg:hidden"
        title="Product Filter"
        onClose={() => setOpenDialog(false)}
      >
        <div className="bg-white rounded-2xl p-4 m-4 lg:hidden">
          <div className="space-y-6">
            <div>
              <label className={cn(labelStyle)}>
                {translate("Parent_Categories")}
              </label>
              <Select
                styles={customStyles}
                value={
                  tempSelectedCategory
                    ? {
                        value: tempSelectedCategory,
                        label:
                          parentCategory.find(
                            (ele) => ele._id === tempSelectedCategory
                          )?.name || tempSelectedCategory,
                      }
                    : null
                }
                onChange={(val: Option | null) => {
                  handleTempCategoryChange(val?.value || "");
                }}
                options={parentCategory.map((ele) => ({
                  value: ele._id,
                  label: ele.name,
                }))}
                menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
                classNamePrefix="select"
                placeholder="Parent Category"
                isClearable
              />
            </div>

            <Button
              onClick={handleApplyFilters}
              className="w-full bg-primary text-white rounded-md"
            >
              {translate("Ok")}
            </Button>
          </div>
        </div>
      </DialogLayout>

      {/* Desktop view */}
      <div
        className={cn(
          "hidden gap-4 grid-cols-1 relative z-[999]",
          xlBreakPoint ? " 2xl:grid " : " lg:grid "
        )}
      >
        <Select
          styles={customStyles}
          value={
            selectedCategory
              ? {
                  value: selectedCategory,
                  label:
                    parentCategory.find((ele) => ele._id === selectedCategory)
                      ?.name || selectedCategory,
                }
              : null
          }
          onChange={(val: Option | null) => {
            handleCategoryChange(val?.value || "");
          }}
          options={parentCategory.map((ele) => ({
            value: ele._id,
            label: ele.name,
          }))}
          classNamePrefix="select"
          placeholder="Parent Category"
          isClearable
        />
      </div>
    </>
  );
};

export default CategorySubCategorySelect;
