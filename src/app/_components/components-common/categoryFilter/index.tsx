"use client";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import React, { useEffect, useState } from "react";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { useAuthStore } from "@/lib/store/auth-user";
import { toastMessage } from "@/lib/utils/toast-message";
import Categories from "@/app/(user)/dashboard/_component/categories";
import { usePathname } from "next/navigation";

interface ICategorySliderFilter {
  type?: string;
  onChange?: (category: string, subCategory?: string) => void;
  onSearch?: (val: string) => void;
  isIncludeSearch?: boolean;
  search?: string;
}

export default function CategorySliderFilter({
  type,
  onChange,
  onSearch,
  search,
  isIncludeSearch = false,
}: ICategorySliderFilter) {
  const translate = useTranslations();
  const pathname = usePathname();
  const initialCategory: ICategory = {
    name: "ALL",
    _id: "All",
    parentId: null,
  };
  const [categories, setCategories] = useState<ICategory[]>([initialCategory]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([
    initialCategory,
  ]);
  const [activeCategory, setActiveCategoryTabId] = useState("All");
  const [activeSubCategory, setActiveSubCategoryTabId] = useState("All");

  useEffect(() => {
    fetchCategory();
  }, []);
  useEffect(() => {
    if (activeCategory === "All") {
      setSubCategories([initialCategory]);
    } else {
      fetchSubCategory();
    }
  }, [activeCategory]);

  const fetchCategory = async () => {
    try {
      let temp: "vendor" | "creator" | undefined = undefined;
      if (pathname.includes("vendor")) temp = "creator";
      else if (pathname.includes("creator")) temp = "vendor";
      const response = await getCategories({
        page: 0,
        limit: 0,
        ...(temp ? { type: type ?? temp } : {}),
      });
      let data = response?.data?.data;
      if (data?.length > 0) {
        let category = data?.filter((ele: ICategory) => ele?.parentId === null);
        setCategories([...categories, ...category]);
      } else {
        setCategories([...categories]);
      }
    } catch (error: any) {
      console.log("Error Fetching categories", error.message);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await getCategories({
        page: 0,
        limit: 0,
        parentId: activeCategory,
      });
      let data = response?.data?.data;
      if (data?.length > 0) {
        setSubCategories([...subCategories, ...data]);
      } else {
        setSubCategories([initialCategory]);
      }
    } catch (error: any) {
      console.log("Error Fetching categories", error.message);
    }
  };

  const handleOnSelectCategory = (
    category: string,
    subCategory: string = "All"
  ) => {
    setActiveCategoryTabId(category);
    setActiveSubCategoryTabId(subCategory??"All");
    category === "All" && setSubCategories([initialCategory]);
    onChange &&
      onChange(
        subCategory === "All" ? category === "All" ? "" : category : subCategory
      );
  };

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto  space-y-3 justify-center w-full">
      {categories?.length > 1 && (
        <Categories
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategoryTabId={handleOnSelectCategory}
          isIncludeSearch={isIncludeSearch}
          onChange={onSearch}
          search={search}
        />
      )}
      {subCategories?.length > 1 && (
        <Categories
          categories={subCategories}
          activeCategory={activeSubCategory}
          setActiveCategoryTabId={
            (cat) => {
              setActiveSubCategoryTabId(cat);
              handleOnSelectCategory(activeCategory, cat)}
            }
          onChange={(cat) => handleOnSelectCategory(activeCategory, cat)}
        />
      )}
      {/* {activeCategory === "All" ? (
        productCategories?.length > 0 ? (
          productCategories?.map((ele: ICategory, index) => <>All</>)
        ) : (
          <div className="h-[calc(100vh-145px)]">
            <EmptyPlaceHolder
              title={translate("No_Products_Available")}
              description={translate("No_Products_Available_Description")}
            />
          </div>
        )
      ) : (
        <></>
      )} */}
    </div>
  );
}
