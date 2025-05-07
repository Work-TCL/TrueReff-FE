"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaSlidersH } from "react-icons/fa";
import DialogLayout from "../../ui/layout/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@sohanemon/utils";
import { labelStyle } from "../../ui/form/Input";
import { translate } from "@/lib/utils/translate";
import { getCategories } from "@/lib/web-api/auth";
import { ICategory } from "../../pages/product-management";
import { boolean } from "yup";

type Option = {
  value: string;
  label: string;
};

interface CategorySubCategorySelectProps {
  onChange: (values: string[]) => void;
  xlBreakPoint?: boolean;
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
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 73, 121, 0.1)" : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(255, 73, 121, 0.2)",
    },
  }),
  // multiValue: (base: any) => ({
  //   ...base,
  //   backgroundColor: "rgba(255, 73, 121, 0.15)",
  //   color: "#FF4979",
  //   borderRadius: "4px",
  //   padding: "2px 4px",
  // }),
  // multiValueLabel: (base: any) => ({
  //   ...base,
  //   color: "#FF4979",
  //   fontWeight: 500,
  // }),
  // multiValueRemove: (base: any) => ({
  //   ...base,
  //   color: "#FF4979",
  //   ":hover": {
  //     backgroundColor: "rgba(255, 73, 121, 0.3)",
  //     color: "white",
  //   },
  // }),
};

const CategorySubCategorySelect: React.FC<CategorySubCategorySelectProps> = ({
  onChange,
  xlBreakPoint,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  // Temporary States for Dialog
  const [tempSelectedParents, setTempSelectedParents] = useState<string[]>([]);
  const [tempSelectedSubs, setTempSelectedSubs] = useState<string[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [subCategory, setSubCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );

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

  const selectedParentOptions = selectedCategories.map((id) => {
    const match = parentCategory.find((opt) => String(opt._id) === String(id));
    return { value: id, label: match?.name || id };
  });

  const selectedSubOptions = selectedSubCategories.map((id) => {
    const match = subCategory.find((opt) => String(opt._id) === String(id));
    return { value: id, label: match?.name || id };
  });

  const tempSelectedParentOptions = tempSelectedParents.map((id) => {
    const match = parentCategory.find((opt) => String(opt._id) === String(id));
    return { value: id, label: match?.name || id };
  });

  const tempSelectedSubOptions = tempSelectedSubs.map((id) => {
    const match = subCategory.find((opt) => String(opt._id) === String(id));
    return { value: id, label: match?.name || id };
  });

  const handleApplyFilters = async () => {
    handleSelectCategory(tempSelectedParents, true);
    handleSelectSubCategory(tempSelectedSubs, true);
    onChange([...tempSelectedParents, ...tempSelectedSubs]);
    setOpenDialog(false);
  };

  const handleSelectCategoryTmp = (selectedOptions: any) => {
    const selectedIds = selectedOptions;
    setTempSelectedParents(selectedIds);

    const optionsSubCategory = categories.filter((ele) =>
      selectedIds.includes(ele?.parentId || "")
    );
    setSubCategory(optionsSubCategory);

    // Filter selected subcategories to only include available ones
    const availableSubCategoriesIds = optionsSubCategory.map((v) => v._id);
    let selectedSubCategory = tempSelectedSubs.filter((id) =>
      availableSubCategoriesIds.includes(id)
    );
    setTempSelectedSubs(selectedSubCategory);
  };
  const handleSelectCategory = (selectedOptions: any, silent?: boolean) => {
    const selectedIds = selectedOptions;
    setSelectedCategories(selectedIds);

    const optionsSubCategory = categories.filter((ele) =>
      selectedIds.includes(ele?.parentId || "")
    );

    setSubCategory(optionsSubCategory);

    // Filter selected subcategories to only include available ones
    const availableSubCategoriesIds = optionsSubCategory.map((v) => v._id);
    let selectedSubCategory = selectedSubCategories.filter((id) =>
      availableSubCategoriesIds.includes(id)
    );
    setSelectedSubCategories(selectedSubCategory);

    if (!silent) {
      onChange([...selectedIds, ...selectedSubCategory]);
    }
  };

  const handleSelectSubCategory = (selectedOptions: any, silent?: boolean) => {
    const selectedIds = selectedOptions;
    setSelectedSubCategories(selectedIds);
    if (!silent) {
      onChange([...selectedIds, ...selectedCategories]);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (openDialog) {
      // When dialog opens, clone the selected values
      setTempSelectedParents([...selectedCategories]);
      setTempSelectedSubs([...selectedSubCategories]);
    }
  }, [openDialog, selectedCategories, selectedSubCategories]);

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
                Parent Categories (max 3)
              </label>
              <Select
                styles={customStyles}
                value={tempSelectedParentOptions}
                isMulti
                onChange={(val) =>
                  handleSelectCategoryTmp(val.map((opt: Option) => opt.value))
                }
                options={parentCategory.map((ele) => ({
                  value: ele._id,
                  label: ele.name,
                }))}
                isOptionDisabled={() => tempSelectedParents.length >= 3}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Parent Categories (max 3)"
              />
            </div>
            <div>
              <label className={cn(labelStyle)}>Subcategories (max 3)</label>
              <Select
                styles={customStyles}
                value={tempSelectedSubOptions}
                isMulti
                onChange={(val) =>
                  setTempSelectedSubs(val.map((opt: Option) => opt.value))
                }
                options={subCategory.map((ele) => ({
                  value: ele._id,
                  label: ele.name,
                }))}
                isOptionDisabled={() => tempSelectedSubs.length >= 3}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Subcategories (max 3)"
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
      <div
        className={cn(
          "hidden grid-cols-2 gap-4 relative z-[999]",
          xlBreakPoint ? " 2xl:grid " : " lg:grid "
        )}
      >
        <Select
          styles={customStyles}
          value={selectedParentOptions}
          isMulti
          onChange={(val) =>
            handleSelectCategory(val.map((opt: Option) => opt.value))
          }
          options={parentCategory.map((ele) => ({
            value: ele._id,
            label: ele.name,
          }))}
          isOptionDisabled={() => selectedCategories.length >= 3}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Parent Categories (max 3)"
        />
        <Select
          styles={customStyles}
          value={selectedSubOptions}
          isMulti
          onChange={(val) =>
            handleSelectSubCategory(val.map((opt: Option) => opt.value))
          }
          options={subCategory.map((ele) => ({
            value: ele._id,
            label: ele.name,
          }))}
          isOptionDisabled={() => selectedSubCategories.length >= 3}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Subcategories (max 3)"
        />
      </div>
    </>
  );
};

export default CategorySubCategorySelect;
