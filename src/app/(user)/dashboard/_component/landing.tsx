"use client";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import React, { useEffect, useState } from "react";
import Categories from "./categories";
import AllProductList from "./all-product-list";
import ProductList from "./product-list";
import { EmptyPlaceHolder } from "@/app/_components/ui/empty-place-holder";
import { useTranslations } from "next-intl";
import axios from "@/lib/web-api/axios";
import { useAuthStore } from "@/lib/store/auth-user";
import { toastMessage } from "@/lib/utils/toast-message";

export default function Landing(){
  const translate = useTranslations();
  const initialCategory: ICategory = {
    name: "ALL",
    _id: "All",
    parentId: null,
  }
    
  const [categories, setCategories] = useState<ICategory[]>([
    initialCategory
  ]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([
    initialCategory
  ]);
  const [productCategories, setProductCategories] = useState<ICategory[]>([]);
  const [activeCategory, setActiveCategoryTabId] = useState("All");
  const [activeSubCategory, setActiveSubCategoryTabId] = useState("All");

  useEffect(() => {
    fetchCategory();
    fetchProductCategories();
  }, []);
  useEffect(() => {
    if (activeCategory === "All") {
      setSubCategories([]);
    } else {
      fetchSubCategory();
    }
  }, [activeCategory]);
  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      if (data?.length > 0) {
        let category = data?.filter((ele: ICategory) => ele?.parentId === null);
        setCategories([...categories, ...category]);
      } else {
        setCategories([...categories])
      }
    } catch (error: any) {
      console.log("Error Fetching categories", error.message);
    }
  };
   const fetchSubCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0, parentId: activeCategory });
      let data = response?.data?.data;
      if (data?.length > 0) {
        setSubCategories([...subCategories, ...data]);
      } else {
        setSubCategories([...subCategories])
      }
    } catch (error: any) {
      console.log("Error Fetching categories", error.message);
    }
  };
  const fetchProductCategories = async () => {
    try {
      const response = await axios.get(
        `/product/category-for-slider`
      );
      let data = response?.data?.data?.data;
      if (data?.length > 0) {
        setProductCategories(data);
      } else {
        setProductCategories([])
      }
    } catch (error: any) {
      console.log("Error Fetching categories", error.message);
      setProductCategories([])
    }
  };
  const handleOnSelectCategory = (category: string) => {
    if (category === activeCategory) return;
    setActiveCategoryTabId(category);
    setActiveSubCategoryTabId("All");
    setSubCategories([initialCategory]);
  };
  return <div className="flex flex-col max-w-[1200px] mx-auto p-2 md:p-4 space-y-3 justify-center">
    {categories?.length > 1 && <Categories categories={categories} activeCategory={activeCategory} setActiveCategoryTabId={handleOnSelectCategory} />}
    {subCategories?.length > 1 && <Categories categories={subCategories} activeCategory={activeSubCategory} setActiveCategoryTabId={setActiveSubCategoryTabId} />}
    {activeCategory === "All" ? productCategories?.length > 0 ? productCategories?.map((ele: ICategory, index) => (
      <AllProductList key={ele?.name} category={ele} setActiveCategoryTabId={handleOnSelectCategory} />
    )) : <div className="h-[calc(100vh-145px)]">
      <EmptyPlaceHolder title={translate("No_Products_Available")} description={translate("No_Products_Available_Description")} />
    </div> : <ProductList key={activeCategory} category={activeCategory} subCategory={activeSubCategory} />}
  </div>
}