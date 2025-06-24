"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { FaSlidersH } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@sohanemon/utils";
import { getCategories } from "@/lib/web-api/auth";
import { useTranslations } from "next-intl";
import { ICategory } from "../../product-management";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import { labelStyle } from "@/app/_components/ui/form/Input";
import { IStatus } from "../../vendor-collobration/collaboration";

type Option = {
    value: string;
    label: string;
};

interface CategorySubCategorySelectProps {
    onChange: (values: string[]) => void;
    handleSelectStatus: (values: string) => void;
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
    menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
  menu: (base: any) => ({ ...base, zIndex: 99999 }),
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

const ProductManageMentFilter: React.FC<CategorySubCategorySelectProps> = ({
    onChange,
    handleSelectStatus,
}) => {
    const translate = useTranslations();
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
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const statusOptions: IStatus[] = [
        { value: "", label: "Select Status" },
        { value: "REQUESTED", label: "Requested" },
        { value: "REJECTED", label: "Rejected" },
        { value: "PENDING", label: "Pending" },
        { value: "LIVE", label: "Live" },
        { value: "EXPIRED", label: "Expired" },
    ];

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
        {/* Desktop view */}
        {/* <div className={cn("hidden gap-4 relative z-[999] md:flex")}>
                <SingleSelect
                    value={selectedStatus}
                    onChange={(value) => { 
                        setSelectedStatus(value);
                        handleSelectStatus(value) }}
                    options={statusOptions}
                    placeholder="Select Status"
                    className="!w-full"
                />
            </div> */}
            {/* Mobile Button */}
            <Button
                variant="outline"
                className={cn("text-black w-[100px] rounded-[4px] h-10 bg-white")}
                onClick={() => setOpenDialog(true)}
            >
                <FaSlidersH className="mr-1" /> {translate("Filters")}
            </Button>

            {/* Mobile Dialog */}
            <DialogLayout
                open={openDialog}
                size="!max-w-[638px] w-full overflow-auto m-2 "
                title="Product Filter"
                onClose={() => setOpenDialog(false)}
            >
                <div className="bg-white rounded-2xl p-4">
                    <div className="flex flex-col gap-2">
                        <div>
                            <label className={cn(labelStyle)}>
                                {translate("Parent_Categories")}
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
                                menuPortalTarget={typeof document !== "undefined" ? document.body:null}
                                isOptionDisabled={() => tempSelectedParents.length >= 3}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Parent Categories (max 3)"
                            />
                        </div>
                        <div>
                            <label className={cn(labelStyle)}>
                                {" "}
                                {translate("Subcategories")}
                            </label>
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
                                menuPortalTarget={typeof document !== "undefined" ? document.body:null}
                                isOptionDisabled={() => tempSelectedSubs.length >= 3}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder="Subcategories (max 3)"
                            />
                        </div>
                        {/* OK Button */}
                        <div className="flex justify-end gap-2 mt-5">
                            <Button
                            onClick={() => setOpenDialog(false)}
                            className="w-1/3 md:w-1/5 bg-white text-secondary border-2 hover:bg-gray-200 rounded-md"
                        >
                            {translate("Cancel")}
                        </Button>
                        <Button
                            onClick={handleApplyFilters}
                            className="w-1/3 md:w-1/5 bg-primary text-white rounded-md"
                        >
                            {translate("Ok")}
                        </Button>
                        </div>
                    </div>
                </div>
            </DialogLayout>
        </>
    );
};

export default ProductManageMentFilter;
